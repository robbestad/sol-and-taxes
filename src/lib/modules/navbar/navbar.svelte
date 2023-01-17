<script lang="ts">
  import { getNotificationsContext } from 'svelte-notifications';

  import NavbarMobile from './mobile/navbar-mobile.svelte';
  import NavbarDesktop from './desktop/navbar-desktop.svelte';

  const { addNotification } = getNotificationsContext();

  export let user = {};
</script>

<nav class="bg-gray-800">
  <NavbarDesktop {user} />

  <NavbarMobile {user} />
</nav>
