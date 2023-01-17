<script lang="ts">
  import NavbarMobile from './mobile/navbar-mobile.svelte';
  import NavbarDesktop from './desktop/navbar-desktop.svelte';

  export let user = {};
</script>

<nav class="bg-gray-800">
  <NavbarDesktop {user} />

  <NavbarMobile {user} />
</nav>
