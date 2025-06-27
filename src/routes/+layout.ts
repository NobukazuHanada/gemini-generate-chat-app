import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$lib/stores';
import { auth } from '$lib/firebase'; // Import auth from firebase.ts
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import { redirect } from '@sveltejs/kit'; // redirectをインポート

export async function load({ url }) { // urlを引数に追加
  if (browser) {
    // Wait for Firebase Auth to be ready
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        unsubscribe(); // Unsubscribe after the first state change
        resolve();
      });
    });

    // 認証状態をチェックし、必要に応じてリダイレクト
    const currentUser = auth.currentUser;
    if (!currentUser && url.pathname !== '/login' && url.pathname !== '/signup') {
      throw redirect(302, '/login'); // redirectをスロー
    }

    // userストアの購読は引き続き行う (必要であれば)
    // load関数内でgotoを呼び出すと、リダイレクトが遅れる可能性があるため、
    // ここでのgotoは削除し、load関数冒頭のredirectで処理する
    user.subscribe((currentUser) => {
      if (!currentUser && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        // goto('/login'); // ここは削除
      }
    });
  }
}