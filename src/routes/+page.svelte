<script>
  import PageContainer from '$lib/modules/page-container/page-container.svelte';
  import PageHeader from '$lib/modules/page-header/page-header.svelte';
  import TransactionTimeline from '$lib/modules/transaction-timeline/transaction-timeline.svelte';
  import MiniPlusIcon from '$lib/shared/icons/mini-plus-icon.svelte';
  import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';

  export let data;

  let isLoading;

  const fetchTransactionHistory = async () => {
    const res = await fetch(`/api/transaction-history`, {
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

    console.log('res: ', res);
  };
</script>

<PageContainer>
  <svelte:fragment slot="page-header">
    <PageHeader title={'Projects'}>
      <svelte:fragment slot="primary-action">
        {#if data.projects?.length > 0}
          <button
            on:click={() => {
              console.log('hello');
            }}
            disabled={isLoading || (data.projects.length >= 5 && !data.isPaidUser)}
            type="button"
            class="inline-flex gap-1 disabled:opacity-50 items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <MiniPlusIcon />
            New project
          </button>
        {/if}
      </svelte:fragment>
    </PageHeader>
  </svelte:fragment>

  <svelte:fragment slot="page-content">
    <button
      on:click={fetchTransactionHistory}
      type="button"
      class="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >Button text</button
    >

    <TransactionTimeline />
  </svelte:fragment>
</PageContainer>
