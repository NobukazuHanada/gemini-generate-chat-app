<script lang="ts">
  let { content, isBold, textColor, fontSize } = $props();

  // スタイルを適用するための関数
  function getStyle(color: string, size: string) {
    let style = `color: ${color};`; // 常に色を適用
    if (size !== 'medium') {
      style += `font-size: ${size};`;
    }
    return style;
  }
</script>

<span style={getStyle(textColor, fontSize)}>
  {#if isBold}
    <strong>{content}</strong>
  {:else}
    {content}
  {/if}
</span>

<style>
  span {
    white-space: pre-wrap;
  }
</style>