<script lang="ts">
  import { db } from '$lib/firebase';
  import { user } from '$lib/stores';
  import { collection, addDoc } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  let roomName = $state('');
  let error: string | null = $state(null);

  async function createRoom() {
    if (roomName.trim() === '') {
      error = 'Room name cannot be empty.';
      return;
    }

    if (!$user || !$user.uid) {
      error = 'You must be logged in to create a room.';
      return;
    }

    try {
      await addDoc(collection(db, "chatRooms"), {
        name: roomName,
        createdAt: new Date(),
        creatorId: $user.uid,
      });
      goto('/'); // ルーム作成後、メインページに戻る
    } catch (err: any) {
      error = err.message;
      console.error("Error creating room: ", error);
    }
  }
</script>

<div class="container">
  <h1>Create New Chat Room</h1>
  <form onsubmit={e => { e.preventDefault(); createRoom(); }}>
    <label for="roomName">Room Name:</label>
    <input type="text" id="roomName" bind:value={roomName} required />

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit">Create Room</button>
  </form>
  <p><a href="/">Back to Chat</a></p>
</div>

<style>
  .container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    box-shadow: var(--shadow-md);
  }
  h1 {
    text-align: center;
    color: var(--color-text);
  }
  form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }
  label {
    font-weight: bold;
    color: var(--color-text-light);
  }
  input[type="text"] {
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1em;
    width: 100%;
    background-color: var(--color-background);
    color: var(--color-text);
  }

  input[type="text"]:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }

  button {
    padding: 12px 20px;
    background-color: var(--color-success);
    color: var(--color-surface); /* ボタンの文字色をCSS変数に */
    border: 1px solid var(--color-success); /* ボタンの枠線を追加 */
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 500;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }

  button:hover {
    background-color: var(--color-success-dark);
    border-color: var(--color-success-dark);
    box-shadow: var(--shadow-md);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-success);
  }
  .error {
    color: var(--color-error);
    text-align: center;
  }
  p {
    text-align: center;
    margin-top: 20px;
  }
  a {
    color: var(--color-primary);
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
