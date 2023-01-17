<script lang="ts">
  import { WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';

  import NavbarDesktopLinks from './navbar-desktop-links.svelte';
  import NavbarDesktopUser from './navbar-desktop-user.svelte';

  export let user = {};
</script>

<div class="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div class="hidden md:flex h-14 items-center justify-between">
    <NavbarDesktopLinks />

    <div class="hidden md:block">
      <div class="ml-4 flex gap-4 items-center md:ml-6">
        <NavbarDesktopUser {user} />

        <!-- Only way to update styles is through :global() https://github.com/svelte-on-solana/wallet-adapter/issues/19 -->
        <WalletMultiButton />
      </div>
    </div>
  </div>
</div>
