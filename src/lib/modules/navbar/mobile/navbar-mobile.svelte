<script lang="ts">
  import { fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { Popover, PopoverButton } from '@rgossiaux/svelte-headlessui';
  import XMarkIcon from '$lib/shared/icons/x-mark-icon.svelte';
  import Bars3Icon from '$lib/shared/icons/bars-3-icon.svelte';
  import NavbarMobilePanel from './navbar-mobile-panel.svelte';
  import { logoCdnLnk } from '$lib/shared/shared.constant';

  export let user = {};
</script>

<Popover let:open>
  <div class="md:hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <!-- Logo -->
      <button
        on:click={() => {
          goto('/');
        }}
        class="flex items-center"
      >
        <div class="flex justify-center items-center gap-2 flex-shrink-0">
          <img
            class="h-8 w-8"
            src={logoCdnLnk}
            alt="Your Company"
          />
          <span class="text-xl font-medium text-white"> Sol and Taxes </span>
        </div>
      </button>

      <!-- Mobile menu button -->
      <div class="-mr-2 flex md:hidden">
        <PopoverButton
          aria-label="Toggle profile dropdown"
          class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          {#if open}
            <span class="sr-only">Open main menu</span>
            <XMarkIcon />
          {:else}
            <span class="sr-only">Open main menu</span>
            <Bars3Icon />
          {/if}
        </PopoverButton>
      </div>
    </div>
  </div>

  {#if open}
    <div transition:fade>
      <NavbarMobilePanel {user} />
    </div>
  {/if}
</Popover>
