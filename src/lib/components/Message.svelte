<script lang="ts">
  import { user } from '../../lib/stores';
  import { db } from '../../lib/firebase';
  import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
  import DrawingCanvas from './DrawingCanvas.svelte';

  let { message, roomId, isCreator } = $props();

  let isEditing = $state(false);
  let editedContent = $state(message.content);

  $effect(() => {
    editedContent = message.content;
  });

  async function deleteMessage() {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, "chatRooms", roomId, "messages", message.id));
      } catch (error) {
        console.error("Error deleting message: ", error);
      }
    }
  }

  async function saveEditedMessage() {
    try {
      await updateDoc(doc(db, "chatRooms", roomId, "messages", message.id), {
        content: editedContent,
        edited: true,
      });
      isEditing = false;
    } catch (error) {
      console.error("Error updating message: ", error);
    }
  }

  function startEditing() {
    isEditing = true;
  }

  function cancelEdit() {
    editedContent = message.content;
    isEditing = false;
  }

    let canEditOrDelete = $derived($user?.uid === message.userId || isCreator);
</script>

<div class="message-item" class:my-message={$user?.uid === message.userId}>
  <div class="message-header">
    <span class="username">{message.username}</span>
    <span class="timestamp">{new Date(message.timestamp.seconds * 1000).toLocaleString()}</span>
    {#if message.edited}
      <span class="edited-tag">(edited)</span>
    {/if}
  </div>
  <div class="message-content" style="font-size: {message.fontSize || 'medium'};">
    {#if isEditing}
      <textarea bind:value={editedContent}></textarea>
      <div class="edit-actions">
        <button onclick={saveEditedMessage}>Save</button>
        <button onclick={cancelEdit}>Cancel</button>
      </div>
    {:else}
      {@html message.content}
    {/if}
    {#if message.drawing && message.drawing.length > 0}
      <DrawingCanvas initialDrawingData={message.drawing} readOnly={true} />
    {/if}
  </div>
  {#if canEditOrDelete}
    <div class="message-actions">
      {#if $user?.uid === message.userId}
        <button onclick={startEditing}>Edit</button>
      {/if}
      <button onclick={deleteMessage}>Delete</button>
    </div>
  {/if}
</div>

<style>
  .message-item {
    background-color: var(--color-surface); /* 白を基調に */
    padding: 12px 16px; /* パディング調整 */
    border-radius: 18px; /* 角をより丸く */
    margin-bottom: 8px; /* マージン調整 */
    max-width: 75%; /* 最大幅を少し広げる */
    box-shadow: var(--shadow-sm); /* 控えめな影 */
    word-break: break-word; /* 長い単語の折り返し */
  }

  .my-message {
    background-color: var(--color-my-message-bg);
    align-self: flex-end;
    margin-left: auto;
    color: var(--color-text); /* テキスト色 */
  }

  .message-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 8px;
    font-size: 0.75em; /* フォントサイズ調整 */
    color: var(--color-text-light); /* 薄いテキスト色 */
    margin-bottom: 4px; /* マージン調整 */
  }

  .username {
    font-weight: 500; /* フォントウェイト調整 */
    color: var(--color-primary-dark); /* ユーザー名をプライマリカラーに */
  }

  .timestamp {
    margin-left: 8px; /* マージン調整 */
  }

  .edited-tag {
    font-style: italic;
    margin-left: 5px;
    color: var(--color-text-light);
  }

  .message-content {
    word-wrap: break-word;
    font-size: 0.95em; /* フォントサイズ調整 */
    line-height: 1.4; /* 行の高さ調整 */
    white-space: pre-wrap; /* 改行を保持し、自動折り返し */
  }

  .message-content textarea {
    width: 100%;
    min-height: 60px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 8px;
    font-size: 1em;
    resize: vertical;
    background-color: var(--color-surface); /* 背景色を白に */
    color: var(--color-text);
  }

  .message-content textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }

  .edit-actions button {
    margin-right: 8px;
    padding: 6px 12px;
    border: 1px solid var(--color-primary); /* ボタンの枠線を追加 */
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--color-primary);
    color: var(--color-surface); /* ボタンの文字色をCSS変数に */
    font-size: 0.9em;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }

  .edit-actions button:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  .edit-actions button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary);
  }

  .message-actions {
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
    justify-content: flex-end; /* 右寄せ */
  }

  .message-actions button:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  .message-actions button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary);
  }
</style>