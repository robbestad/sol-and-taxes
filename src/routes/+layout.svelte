<script>
  import Notifications from 'svelte-notifications';
  import Modal from 'svelte-simple-modal';

  import Toast from '$lib/modules/toast/toast.svelte';

  import '../app.css';

  let _Toast = Toast;
</script>

<svelte:head>
  <title>
    Sol and Taxes – Crypto gains and losses tax calculator for Solana wallets
  </title>
  <meta
    name="description"
    content="Calculate tax gains and losses straight from your phantom wallet. Analyze all your transactions and get a detailed report to help with your taxes."
  />
</svelte:head>

<Notifications item={_Toast}>
  <Modal
    closeButton={true}
    unstyled={false}
    styleWindow={{ width: '75%' }}
  >
    <slot />
  </Modal>
</Notifications>
