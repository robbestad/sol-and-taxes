<script lang="ts">
  import { getNotificationsContext } from 'svelte-notifications';
  import { goto, invalidateAll } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';

  import { nhost } from '$lib/core/nhost/nhost';
  import { notifcationSettings } from '$lib/shared/shared.constant';
  import Cog_6ToothIcon from '$lib/shared/icons/cog-6-tooth-icon.svelte';
  import ArrowLeftOnRectangleIcon from '$lib/shared/icons/arrow-left-on-rectangle-icon.svelte';
  import UserIcon from '$lib/shared/icons/user-icon.svelte';

  const { addNotification } = getNotificationsContext();

  export let user = {} as any;

  $: ({ userSettings = {} } = user);
  $: ({ handle = '' } = userSettings);

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

<div class="relative ml-3">
  <Popover let:open>
    <PopoverButton
      class="flex items-center"
      aria-label="Toggle profile dropdown"
    >
      <span class="sr-only">Open user menu</span>
      <span class="inline-block items-center">
        <UserIcon extraClasses="text-white" />
      </span>
    </PopoverButton>

    {#if open}
      <div transition:fade>
        <PopoverPanel as="div">
          <div
            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabindex="-1"
          >
            <a
              href={'/settings'}
              class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-1"
            >
              <Cog_6ToothIcon extraClasses="text-gray-700 h-3.5 w-3.5" />
              Settings
            </a>

            <button
              on:click={handleSignout}
              class="w-full flex items-center gap-2 justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
              tabindex="-1"
              id="user-menu-item-2"
            >
              <ArrowLeftOnRectangleIcon extraClasses="text-gray-700 h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </PopoverPanel>
      </div>
    {/if}
  </Popover>
</div>
