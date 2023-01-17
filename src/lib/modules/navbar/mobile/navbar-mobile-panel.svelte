<script lang="ts">
  import { getNotificationsContext } from 'svelte-notifications';
  import { goto, invalidateAll } from '$app/navigation';

  import { nhost } from '$lib/core/nhost/nhost';
  import { notifcationSettings } from '$lib/shared/shared.constant';

  const { addNotification } = getNotificationsContext();

  export let user = {} as any;

  $: ({ userSettings = {} } = user);
  $: ({ displayName = '', handle = '' } = userSettings);

  const handleSignout = async () => {
    await nhost.auth.signOut();
    await invalidateAll();
    goto('/');
    addNotification({
      ...notifcationSettings,
      text: 'Sign out successful'
    });
  };
</script>

<div
  class="md:hidden"
  id="mobile-menu"
>
  <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
    <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
    <a
      href="/projects"
      class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
      aria-current="page"
    >
      Projects
    </a>

    <a
      href={`/usage`}
      class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
    >
      Usage
    </a>

    <a
      href={'/plans'}
      class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
    >
      Plans
    </a>
    <div class="border-t border-gray-700 pt-4 pb-3">
      <!-- User links -->
      <a
        href={'/settings'}
        class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
      >
        Settings
      </a>

      <button
        on:click={handleSignout}
        class="w-full flex justify-start items-center rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
        >Sign out</button
      >
    </div>
  </div>
</div>
