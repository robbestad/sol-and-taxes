<script lang="ts">
  import { getNotificationsContext } from 'svelte-notifications';
  import { WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';
  import { notifcationSettings } from '$lib/shared/shared.constant';

  import NavbarMobile from './mobile/navbar-mobile.svelte';
  import NavbarDesktop from './desktop/navbar-desktop.svelte';
  import { signIn } from '../auth/auth-utils';

  const { addNotification } = getNotificationsContext();

  export let user = {};

  const wrappedSignIn = async () => {
    const userJwt = await signIn();

    if (userJwt) {
      addNotification({
        ...notifcationSettings,
        text: 'Sign in successful'
      });
    }
  };
</script>

<nav class="bg-gray-800">
  <WalletMultiButton />
  <NavbarDesktop {user} />

  <NavbarMobile {user} />
</nav>
