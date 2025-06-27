<script lang="ts">
  import { db } from '../../lib/firebase';
  import { user, selectedRoomId } from '../../lib/stores';
  import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
  import DrawingCanvas from './DrawingCanvas.svelte';
  import TextFormattingInput from './TextFormattingInput.svelte'; // Import the new component

  let messageContent = $state('');
  let drawingData: string[] = $state([]);
  let drawingCanvasRef: DrawingCanvas;

  let isBold = $state(false);
  let textColor = $state('#000000');
  let fontSize = $state('medium');

  async function sendMessage() {
    if (!$selectedRoomId) {
      alert('Please select a chat room first.');
      return;
    }

    if (messageContent.trim() === '' && (!drawingData || drawingData.length === 0)) return;

    let formattedContent = messageContent;
    if (isBold) {
      formattedContent = `<strong>${formattedContent}</strong>`;
    }
    if (textColor !== '#000000') {
      formattedContent = `<span style="color: ${textColor};">${formattedContent}</span>`;
    }
    if (fontSize !== 'medium') {
      formattedContent = `<span style="font-size: ${fontSize};">${formattedContent}</span>`;
    }

    try {
      await addDoc(collection(db, "chatRooms", $selectedRoomId, "messages"), {
        userId: $user?.uid,
        username: $user?.displayName || $user?.email || 'Anonymous',
        content: formattedContent,
        timestamp: serverTimestamp(),
        drawing: drawingData,
        fontSize: fontSize,
      });
      messageContent = '';
      drawingData = [];
      if (drawingCanvasRef) {
        drawingCanvasRef.clearCanvas();
      }
      isBold = false;
      textColor = '#000000';
      fontSize = 'medium';
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }
</script>

<div class="message-input-container">
  <div class="input-area-flex">
    <TextFormattingInput
      bind:value={messageContent}
      bind:isBold={isBold}
      bind:textColor={textColor}
      bind:fontSize={fontSize}
      onSendMessage={sendMessage}
    />
    <DrawingCanvas bind:this={drawingCanvasRef} bind:drawingData={drawingData} />
  </div>

  <button onclick={sendMessage}>Send</button>
</div>

<style>
  .message-input-container {
    display: grid;
    grid-template-rows: 1fr auto; /* 入力エリアと送信ボタン */
    gap: 15px; /* 間隔を広げる */
    padding: 15px 20px; /* パディング調整 */
    border-top: 1px solid var(--color-border);
    background-color: var(--color-surface);
    box-shadow: var(--shadow-sm);
  }

  .input-area-flex {
    display: grid;
    grid-template-rows: 1fr 1fr; /* テキスト入力と描画キャンバス */
    gap: 15px;
  }

  button {
    padding: 12px 20px;
    background-color: var(--color-primary);
    color: var(--color-surface); /* ボタンの文字色をCSS変数に */
    border: 1px solid var(--color-primary); /* ボタンの枠線を追加 */
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 500;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }

  button:hover {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }
</style>