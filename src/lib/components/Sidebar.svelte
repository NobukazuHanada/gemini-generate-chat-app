<script lang="ts">
  import { db } from '$lib/firebase';
  import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
  import { user, selectedRoomId } from '$lib/stores';
  import { goto } from '$app/navigation';

  interface ChatRoom {
    id: string;
    name: string;
    createdAt: Date;
    creatorId: string;
  }

  let chatRooms: ChatRoom[] = $state([]);

  // Fetch chat rooms in real-time
  const q = query(collection(db, "chatRooms"), orderBy("createdAt", "asc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    chatRooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ChatRoom[];
  });

  function navigateToCreateRoom() {
    goto('/create-room');
  }

  // Cleanup on component destroy
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="sidebar-content">
  <h3>Rooms</h3>
  <button onclick={navigateToCreateRoom} class="create-room-button">Create New Room</button>
  <ul class="room-list">
    {#each chatRooms as room (room.id)}
      <a
        class="room-item"
        class:selected={$selectedRoomId === room.id}
        href="/chat/{room.id}"
      >
        {room.name} <span class="room-id">({room.id})</span>
      </a>
    {/each}
  </ul>
</div>

<style>
  .sidebar-content {
    display: grid;
    grid-template-rows: auto auto 1fr; /* ヘッダー、ボタン、ルームリスト */
    gap: 20px; /* 要素間のスペース */
    height: 100%;
    color: var(--color-text);
    overflow: auto;
  }
  h3 {
    margin-top: 0;
    margin-bottom: 20px; /* マージン調整 */
    color: var(--color-text);
    font-size: 1.4em; /* フォントサイズ調整 */
    font-weight: 500;
  }
  .create-room-button {
    padding: 10px 15px;
    background-color: var(--color-success-dark);
    color: var(--color-text); /* ボタンの文字色をCSS変数に */
    border: 1px solid var(--color-success); /* 明確なボーダー */
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    margin-bottom: 20px;
    transition: background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .create-room-button:hover {
    background-color: var(--color-success-dark);
    box-shadow: var(--shadow-md);
    border-color: var(--color-success-dark);
  }

  .create-room-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-success-focus);
  }

  .room-list {
    height: 100%;
    overflow: auto;
  }

  .room-item {
    padding: 12px 10px;
    cursor: pointer;
    border-bottom: 1px solid var(--color-border);
    transition: background-color 0.2s ease;
    font-size: 0.95em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-decoration: none; /* アンダーラインを削除 */
    color: inherit; /* 親要素から色を継承 */
  }

  .room-item:hover {
    background-color: var(--color-background);
  }

  .room-item.selected {
    background-color: var(--color-primary-dark);
    color: var(--color-text); /* 選択時のテキスト色をCSS変数に */
    font-weight: 500;
  }

  .room-item.selected .room-id {
    color: var(--color-surface-alpha-80);
  }

  .room-id {
    font-size: 0.8em;
    color: var(--color-text-light);
  }
</style>