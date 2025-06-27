<script lang="ts">
  import { onMount } from 'svelte';
  import DrawingControls from './DrawingControls.svelte';

  let { initialDrawingData = [], drawingData = $bindable(), readOnly = false } = $props();

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let isDrawing = $state(false);
  let currentPath: { x: number; y: number; type: string; color?: string; width?: number }[] = $state([]);

  let currentColor = $state('#000000'); // 初期値を設定
  let currentWidth = $state(2);

  onMount(() => {
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // キャンバスの内部描画サイズをCSSで表示されているサイズに合わせる
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    if (!readOnly) {
      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);
    }

    // If initialDrawingData is provided, draw it
    if (initialDrawingData && initialDrawingData.length > 0) {
      initialDrawingData.forEach(pathJson => {
        const path = JSON.parse(pathJson);
        redrawPath(path);
      });
    }
  });

  function startDrawing(e: MouseEvent) {
    if (readOnly) return; // 読み取り専用の場合は描画しない
    isDrawing = true;
    currentPath = [];
    const { offsetX, offsetY } = e;
    currentPath.push({ x: offsetX, y: offsetY, type: 'start', color: currentColor, width: currentWidth });
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentWidth;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  }

  function draw(e: MouseEvent) {
    if (!isDrawing || readOnly) return; // 読み取り専用の場合は描画しない
    const { offsetX, offsetY } = e;
    currentPath.push({ x: offsetX, y: offsetY, type: 'draw' });
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }

  function stopDrawing() {
    if (isDrawing && !readOnly) { // 読み取り専用の場合は描画しない
      isDrawing = false;
      drawingData.push(JSON.stringify(currentPath)); // JSON文字列に変換して保存
    }
  }

  export function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingData = [];
  }

  function redrawPath(path: { x: number; y: number; type: string; color?: string; width?: number }[]) {
    path.forEach(point => {
      if (point.type === 'start') {
        ctx.strokeStyle = point.color || '#000000';
        ctx.lineWidth = point.width || 2;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
      } else if (point.type === 'draw') {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    });
  }

  // React to changes in initialDrawingData (for displaying existing drawings)
  $effect(() => {
    if (initialDrawingData && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      initialDrawingData.forEach(pathJson => {
        const path = JSON.parse(pathJson);
        redrawPath(path);
      });
    }
  });
</script>

<div class="drawing-canvas-container">
  <canvas bind:this={canvas}></canvas>
  {#if !readOnly} <!-- 読み取り専用でない場合のみコントロールを表示 -->
  <DrawingControls
    bind:currentColor={currentColor}
    bind:currentWidth={currentWidth}
    onClearCanvas={clearCanvas}
  />
  {/if}
</div>

<style>
  .drawing-canvas-container {
    min-width: 0; /* Flexアイテムとして正しく縮小できるように */
    display: grid;
    grid-template-rows: 1fr auto; /* キャンバスとコントロール */
    gap: 10px; /* 要素間のスペース */
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px;
    background-color: var(--color-surface);
  }

  canvas {
    display: block;
    margin-bottom: 5px;
    border-radius: 8px; /* 角を丸く */
    width: 100%; /* 親の幅に合わせる */
    height: 100%; /* 親の高さに合わせる */
  }
</style>
