<script lang="ts">
  import { auth } from '$lib/firebase';
  import { user } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { signOut } from 'firebase/auth';
  import "../app.css";

  async function handleSignOut() {
    await signOut(auth);
    goto('/login');
  }
</script>

<nav style="grid-area: header;">
  <div class="nav-left">
    <a href="/">Gemini Generated Chat App</a>
  </div>
  <div class="nav-right">
    {#if $user}
      <span>Welcome, {$user.email}</span>
      <button onclick={handleSignOut}>Sign Out</button>
    {:else}
      <a href="/login">Login</a>
      <a href="/signup">Sign Up</a>
    {/if}
  </div>
</nav>

<main style="grid-area: main;">
  <slot />
</main>

<style>
  nav {
    display: grid;
    grid-template-columns: 1fr auto; /* 左側と右側を分割 */
    align-items: center;
    background-color: var(--color-surface); /* 白を基調に */
    color: var(--color-text); /* テキスト色 */
    padding: 10px 20px;
    box-shadow: var(--shadow-sm); /* 控えめな影 */
    position: sticky; /* スクロールしても固定 */
    top: 0;
    z-index: 1000; /* 他の要素の上に表示 */
  }

  nav a {
    color: var(--color-primary); /* プライマリカラー */
    text-decoration: none;
    margin-right: 15px;
    font-weight: 500; /* 少し太字に */
  }

  nav a:hover {
    text-decoration: underline;
    color: var(--color-primary-dark); /* ホバー時の色 */
  }

  .nav-left a {
    font-size: 1.2em; /* 少し大きく */
    font-weight: 700; /* 太字に */
    color: var(--color-text); /* アプリケーション名は濃い色に */
  }

  .nav-right {
    display: grid;
    grid-template-columns: auto auto; /* 項目を横並びにする */
    gap: 15px; /* 項目間のスペース */
    align-items: center;
  }

  .nav-right span {
    margin-right: 15px;
    color: var(--color-text-light); /* 薄いテキスト色 */
  }

  .nav-right button {
    background-color: var(--color-primary);
    color: var(--color-surface); /* ボタンの文字色を白に固定 */
    border: 1px solid var(--color-primary); /* ボタンの枠線を追加 */
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
    font-weight: 500;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .nav-right button:hover {
    background-color: var(--color-primary-dark);
    border-color: var(--color-primary-dark);
    box-shadow: var(--shadow-md);
  }

  button:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-focus);
  }

  main {
    padding: 0;
    margin: 0;
    background-color: var(--color-background); /* 背景色 */
    height: 100%;
    overflow: auto;
  }
</style>
