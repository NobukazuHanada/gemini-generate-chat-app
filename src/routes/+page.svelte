<script lang="ts">
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  onMount(() => {
    const currentUser = get(user);
    if (!currentUser) {
      goto('/login');
    } else {
      // Redirect to a default chat room or a room selection page
      // For now, let's redirect to a placeholder room 'general'
      goto('/chat/general');
    }
  });
</script>

<p>Redirecting...</p>
