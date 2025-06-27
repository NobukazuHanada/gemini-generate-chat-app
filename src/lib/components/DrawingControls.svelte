<script lang="ts">
  let { currentColor = $bindable(), currentWidth = $bindable(), onClearCanvas } = $props();
</script>

<div class="canvas-controls">
  <input type="color" bind:value={currentColor} />
  <input type="range" bind:value={currentWidth} min="1" max="10" />
  <button onclick={onClearCanvas}>Clear</button>
</div>

<style>
  .canvas-controls {
    display: grid;
    grid-template-columns: auto auto 1fr; /* 色、太さ、クリアボタン */
    gap: 10px;
    align-items: center;
  }
  .canvas-controls button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--color-primary); /* プライマリカラー */
    color: var(--color-surface);
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }
  .canvas-controls button:hover {
    background-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }
  .canvas-controls button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }
</style>
