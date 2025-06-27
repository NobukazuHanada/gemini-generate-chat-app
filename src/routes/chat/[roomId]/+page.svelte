<script lang="ts">
  import { auth, db } from '../../../lib/firebase';
  import { signOut } from 'firebase/auth';
  import { user } from '../../../lib/stores';
  import { goto } from '$app/navigation';
  import Sidebar from '../../../lib/components/Sidebar.svelte';
  import { selectedRoomId } from '../../../lib/stores';
  import MessageInput from '../../../lib/components/MessageInput.svelte';
  import Message from '../../../lib/components/Message.svelte';
  import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
  import { onDestroy } from 'svelte';

  let { data } = $props(); // SvelteKit's load function will provide data
  let roomId = $derived(data.roomId); // Get roomId from load function
  let isGeneralRoom = $derived(roomId === 'general'); // New: Check if it's the general room

  let messages: any[] = $state([]);
  let unsubscribeMessages: (() => void) | undefined;
  let currentRoomCreatorId: string | null = $state(null);
  let currentRoomName: string = $state('Loading...'); // New: To store room name

  // Cache for usernames to avoid repeated Firestore reads
  const usernameCache = new Map<string, string>();

  async function handleSignOut() {
    await signOut(auth);
    goto('/login');
  }

  $effect(() => {
    if (roomId) {
      // Update selectedRoomId store when roomId changes from URL
      selectedRoomId.set(roomId);

      // Unsubscribe from previous room's messages if any
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }

      // Fetch room creator ID and name
      const roomDocRef = doc(db, "chatRooms", roomId);
      getDoc(roomDocRef).then(docSnap => {
        if (docSnap.exists()) {
          currentRoomCreatorId = docSnap.data().creatorId;
          currentRoomName = docSnap.data().name;
        } else {
          currentRoomCreatorId = null;
          currentRoomName = 'Room Not Found';
        }
      });

      // Subscribe to new room's messages
      const messagesQuery = query(
        collection(db, "chatRooms", roomId, "messages"),
        orderBy("timestamp", "asc")
      );

      unsubscribeMessages = onSnapshot(messagesQuery, async (querySnapshot) => {
        const newMessages: any[] = [];
        for (const messageDoc of querySnapshot.docs) {
          const messageData = messageDoc.data();
          let username = 'Anonymous';

          // Try to get username from cache first
          if (usernameCache.has(messageData.userId)) {
            username = usernameCache.get(messageData.userId)!;
          } else {
            // If not in cache, fetch from Firestore
            const userDocRef = doc(db, "users", messageData.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              username = userDocSnap.data().username || 'Anonymous';
              usernameCache.set(messageData.userId, username); // Cache the username
            } else if ($user?.uid === messageData.userId) {
              // Fallback for current user if their profile isn't found (shouldn't happen if signup works)
              username = $user?.displayName || $user?.email || 'Anonymous';
            }
          }

          newMessages.push({
            id: messageDoc.id,
            ...messageData,
            username: username,
            timestamp: messageData.timestamp || { seconds: Date.now() / 1000 }
          });
        }
        messages = newMessages;
      });
    }
  });

  onDestroy(() => {
    if (unsubscribeMessages) {
      unsubscribeMessages();
    }
  });
</script>

<div class="chat-container">
  <aside class="sidebar">
    <Sidebar />
  </aside>
  <header class="chat-header">
    <h1>{currentRoomName} ({roomId})</h1>
  </header>
  <div class="messages-input-wrapper">
    <div class="messages-area">
      {#each messages as message (message.id)}
        <Message message={message} roomId={roomId} isCreator={currentRoomCreatorId === $user?.uid} />
      {/each}
    </div>
    <div class="input-area">
      <MessageInput />
    </div>

    {#if isGeneralRoom}
      <div class="general-room-overlay">
        <p>Please select a chat room from the sidebar to send messages.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .chat-container {
    display: grid;
    grid-template-columns: 280px 1fr 1fr; /* サイドバー | メッセージエリア | 入力エリア */
    grid-template-rows: auto 1fr; /* ヘッダー | コンテンツ */
    grid-template-areas:
      "sidebar header header"
      "sidebar messages-and-input messages-and-input";
    height: 100%; /* 親の高さに合わせる */
    font-family: 'Roboto', sans-serif;
    background-color: var(--color-background);
  }

  .sidebar {
    grid-area: sidebar;
    background-color: var(--color-surface); /* 白を基調に */
    padding: 20px;
    border-right: 1px solid var(--color-border); /* ボーダー色 */
    justify-content: space-between;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05); /* 控えめな影 */
    overflow: auto;
    height: 100%;
  }


  .chat-header {
    grid-area: header;
    background-color: var(--color-surface);
    padding: 15px 20px;
    border-bottom: 1px solid var(--color-border);
    box-shadow: var(--shadow-sm);
  }

  .chat-header h1 {
    margin: 0;
    font-size: 1.5em;
    color: var(--color-text);
    font-weight: 500;
  }

  .messages-area {
    padding: 20px;
    background-color: var(--color-background);
    height: 100%;
    overflow: auto;
  }

  .input-area {
    padding: 15px 20px;
    border-top: 1px solid var(--color-border);
    background-color: var(--color-surface);
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  }

  .messages-input-wrapper {
    grid-area: messages-and-input;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr auto;
    position: relative;
    height: 100%;
    overflow: auto;
  }

  .general-room-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: var(--color-text-light);
    font-weight: 500;
    z-index: 10;
    font-size: 1.2em;
  }

  .general-room-overlay p {
    margin: 0;
  }
</style>