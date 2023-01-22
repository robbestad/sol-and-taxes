<script>
  import { onMount } from 'svelte';
  import Notifications from 'svelte-notifications';
  import Modal from 'svelte-simple-modal';
  import {
    WalletProvider,
    ConnectionProvider
  } from '@svelte-on-solana/wallet-adapter-ui';
  import { clusterApiUrl } from '@solana/web3.js';
  import { browser } from '$app/environment';
  import { Buffer } from 'buffer';

  import Toast from '$lib/modules/toast/toast.svelte';

  import '../app.css';

  let _Toast = Toast;
  let wallets;

  const network = clusterApiUrl('mainnet-beta');
  // const network = clusterApiUrl('devnet');

  const localStorageKey = 'solWalletAdapter';

  $: {
    if (browser) {
      window.Buffer = Buffer;
    }
  }

  onMount(async () => {
    const { PhantomWalletAdapter } = await import('@solana/wallet-adapter-wallets');

    wallets = [new PhantomWalletAdapter()];
  });
</script>

<svelte:head>
  <title>Sol and Taxes – Tax calculator for solana wallets</title>
  <meta
    name="description"
    content="Calculate tax gains and losses straight from your wallet. Analyze all your transactions and get a detailed report to help with your taxes."
  />
</svelte:head>

<Notifications item={_Toast}>
  <Modal
    closeButton={true}
    unstyled={false}
    styleWindow={{ width: '75%' }}
  >
    <WalletProvider
      {localStorageKey}
      {wallets}
      autoConnect
    />
    <ConnectionProvider {network} />

    <slot />
  </Modal>
</Notifications>
