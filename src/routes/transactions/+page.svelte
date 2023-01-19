<script>
  import { getNotificationsContext } from 'svelte-notifications';

  import PageContainer from '$lib/modules/page-container/page-container.svelte';
  import PageHeader from '$lib/modules/page-header/page-header.svelte';
  import TransactionTimeline from '$lib/modules/transaction-timeline/transaction-timeline.svelte';
  import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';
  import { transactionHistory$ } from '$lib/shared/shared.store';
  import { notifcationSettings } from '$lib/shared/shared.constant';
  import LoadingButtonSpinnerIcon from '$lib/shared/icons/loading-button-spinner-icon.svelte';

  import EmptyState from './empty-state.svelte';

  const { addNotification } = getNotificationsContext();

  export let data;

  let isLoading;

  const fetchTransactionHistory = async () => {
    isLoading = true;

    const response = await fetch(`/api/transaction-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        something: 'good'
      })
    })
      .then(throwIfHttpError)
      .then(readResponseStreamAsJson);

    transactionHistory$.set(response);

    addNotification({
      ...notifcationSettings,
      text: `${response?.length || 0} Transactions fetched`
    });

    isLoading = false;
  };
</script>

<PageContainer>
  <svelte:fragment slot="page-header">
    <PageHeader title={'Transactions'}>
      <svelte:fragment slot="primary-action">
        {#if isLoading}
          <button
            disabled
            type="button"
            class="inline-flex gap-1 disabled:opacity-50 items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <LoadingButtonSpinnerIcon />
            Fetch transactions
          </button>
        {:else}
          <button
            on:click={fetchTransactionHistory}
            type="button"
            class="inline-flex gap-1 items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Fetch transactions
          </button>
        {/if}
      </svelte:fragment>
    </PageHeader>
  </svelte:fragment>

  <svelte:fragment slot="page-content">
    {#if $transactionHistory$.length > 0}
      <TransactionTimeline />
    {:else}
      <EmptyState {fetchTransactionHistory} />
    {/if}
  </svelte:fragment>
</PageContainer>
