<script lang="ts">
  import NavbarDesktopLinks from './navbar-desktop-links.svelte';
  import NavbarDesktopUser from './navbar-desktop-user.svelte';

  export let user = {};
</script>

<div class="hidden md:block mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div class="hidden md:flex h-14 items-center justify-between">
    <NavbarDesktopLinks />

    <div class="hidden md:block">
      <div class="ml-4 flex items-center md:ml-6">
        <NavbarDesktopUser {user} />
      </div>
    </div>
  </div>
</div>
