<script lang="ts">
  import PreviewContent from './PreviewContent.svelte';

  let { value = $bindable(), isBold = $bindable(), textColor = $bindable(), fontSize = $bindable(), onSendMessage } = $props();

  function toggleBold() {
    isBold = !isBold;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(); // 親コンポーネントの関数を直接呼び出す
    }
  }
</script>

<div class="text-formatting-input-container">
  <div class="formatting-options">
    <button onclick={toggleBold} class:active={isBold}>B</button>
    <input type="color" bind:value={textColor} />
    <select bind:value={fontSize}> <!-- New: Font size selector -->
      <option value="small">Small</option>
      <option value="medium">Medium</option>
      <option value="large">Large</option>
      <option value="x-large">X-Large</option>
    </select>
  </div>

  <textarea
    bind:value={value}
    placeholder="Type your message..."
    onkeydown={handleKeydown}
  ></textarea>

  <div class="preview-area">
    <p>Preview:</p>
    <div class="preview-content">
      <PreviewContent
        content={value}
        isBold={isBold}
        textColor={textColor}
        fontSize={fontSize}
      />
    </div>
  </div>
</div>

<style>
  .text-formatting-input-container {
    display: grid;
    grid-template-rows: auto 1fr auto; /* フォーマットオプション、テキストエリア、プレビュー */
    gap: 10px;
    min-width: 0; /* Flexアイテムとして正しく縮小できるように */
  }

  .formatting-options {
    display: grid;
    grid-template-columns: auto auto auto 1fr; /* Bボタン、カラーピッカー、セレクト、空きスペース */
    gap: 10px;
    align-items: center;
  }

  .formatting-options button {
    padding: 10px 14px; /* パディングを少し増やす */
    border: 1px solid var(--color-border);
    border-radius: 6px; /* 角を少し丸く */
    background-color: var(--color-surface);
    color: var(--color-text-light);
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease, box-shadow 0.2s ease;
    box-shadow: var(--shadow-xs); /* 控えめなシャドウ */
  }

  .formatting-options button.active {
    background-color: var(--color-primary);
    color: var(--color-surface);
    border-color: var(--color-primary);
    font-weight: 700;
    box-shadow: var(--shadow-sm); /* アクティブ時はシャドウを強調 */
  }

  .formatting-options button:hover {
    background-color: var(--color-background);
    box-shadow: var(--shadow-md); /* ホバー時はシャドウを強調 */
  }

  .formatting-options button.active:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-lg);
  }

  .formatting-options button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }

  .formatting-options input[type="color"] {
    border: 1px solid var(--color-border);
    width: 45px; /* 少し大きく */
    height: 35px; /* 少し大きく */
    padding: 0;
    cursor: pointer;
    border-radius: 6px; /* 角を丸く */
    background-color: var(--color-surface);
  }

  .formatting-options select {
    padding: 9px 12px; /* パディング調整 */
    border: 1px solid var(--color-border);
    border-radius: 6px; /* 角を丸く */
    background-color: var(--color-surface);
    cursor: pointer;
    color: var(--color-text);
    box-shadow: var(--shadow-xs); /* 控えめなシャドウ */
    transition: all 0.2s ease;
  }

  .formatting-options select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }

  textarea {
    flex-grow: 1;
    padding: 14px;
    border: 1px solid var(--color-border);
    border-radius: 10px; /* 角をさらに丸く */
    min-height: 90px; /* 最小高さを少し増やす */
    font-size: 1.05em;
    resize: none; /* リサイズハンドルを削除 */
    color: var(--color-text);
    background-color: var(--color-surface);
    width: 100%;
    box-sizing: border-box;
    box-shadow: var(--shadow-xs); /* 控えめなシャドウ */
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px var(--color-primary-focus); /* フォーカス時のシャドウを強調 */
  }

  .preview-area {
    border: none;
    padding: 12px;
    border-radius: 10px;
    background-color: var(--color-surface); /* 背景色をsurfaceに */
    box-shadow: var(--shadow-md); /* シャドウを強調 */
  }

  .preview-content {
    min-height: 45px;
    border: none;
    padding: 10px;
    background-color: var(--color-background); /* 背景色をbackgroundに */
    border-radius: 8px;
    color: var(--color-text);
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.08); /* 内部シャドウを強調 */
  }
</style>