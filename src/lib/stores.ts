import { writable } from 'svelte/store';
import { auth } from './firebase';
import type { User } from 'firebase/auth';

export const user = writable<User | null>(null);
export const selectedRoomId = writable<string | null>(null);

auth.onAuthStateChanged((u) => {
  user.set(u);
});