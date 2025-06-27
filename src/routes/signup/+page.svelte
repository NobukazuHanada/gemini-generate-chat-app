<script lang="ts">
  import { auth, db } from '../../lib/firebase';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { doc, setDoc } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let username = $state('');
  let error: string | null = $state(null);

  async function handleSignup() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save username to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
      });

      goto('/');
    } catch (err: any) {
      error = err.message;
    }
  }
</script>

<div class="container">
  <h1>Sign Up</h1>
  <form onsubmit={e => { e.preventDefault(); handleSignup(); }}>
    <label for="email">Email:</label>
    <input type="email" id="email" bind:value={email} required />

    <label for="password">Password:</label>
    <input type="password" id="password" bind:value={password} required />

    <label for="username">Username:</label>
    <input type="text" id="username" bind:value={username} required />

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit">Sign Up</button>
  </form>
  <p>Already have an account? <a href="/login">Login</a></p>
</div>

<style>
  .container {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px; /* パディングを増やす */
    background-color: var(--color-surface); /* 背景色を白に */
    border-radius: 8px; /* 角を丸く */
    box-shadow: var(--shadow-lg); /* 影を強調 */
  }
  h1 {
    text-align: center;
    color: var(--color-text); /* テキスト色 */
    margin-bottom: 20px; /* マージン調整 */
  }
  form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
  }
  label {
    font-weight: 500; /* フォントウェイト調整 */
    color: var(--color-text-light); /* 薄いテキスト色 */
  }
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    padding: 12px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 1em;
    width: 100%;
    background-color: var(--color-background);
    color: var(--color-text);
  }

  input[type="email"]:focus,
  input[type="password"]:focus,
  input[type="text"]:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-focus);
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
  .error {
    color: var(--color-error); /* エラー色 */
    text-align: center;
    margin-top: 10px; /* マージン調整 */
  }
  p {
    text-align: center;
    margin-top: 20px;
    color: var(--color-text-light); /* 薄いテキスト色 */
  }
  a {
    color: var(--color-primary); /* プライマリカラー */
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
