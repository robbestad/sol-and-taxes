<script>
  import { getNotificationsContext } from 'svelte-notifications';
  import { Popover, PopoverButton, PopoverPanel } from '@rgossiaux/svelte-headlessui';
  import { slide } from 'svelte/transition';
  import Fuse from 'fuse.js';
  import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';
  import { afterUpdate } from 'svelte';
  import { invalidateAll } from '$app/navigation';

  import PageContainer from '$lib/modules/page-container/page-container.svelte';
  import PageHeader from '$lib/modules/page-header/page-header.svelte';
  import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';
  import { banners$ } from '$lib/shared/shared.store';
  import { notifcationSettings } from '$lib/shared/shared.constant';
  import LoadingButtonSpinnerIcon from '$lib/shared/icons/loading-button-spinner-icon.svelte';
  import ChevronDownIcon from '$lib/shared/icons/chevron-down-icon.svelte';
  import MagnifyingGlassIcon from '$lib/shared/icons/magnifying-glass-icon.svelte';
  import { ERROR } from '$lib/shared/shared.type';

  import TransactionsTimeline from './transactions-timeline/transactions-timeline.svelte';
  import TransactionsSettings from './transactions-settings/transactions-settings.svelte';
  import EmptyState from './empty-state.svelte';
  import TaxSummary from './tax-summary/tax-summary.svelte';

  const { addNotification } = getNotificationsContext();
  const fuseOptions = {
    threshold: 0.1,
    keys: [
      'description',
      'feePayer',
      'signature',
      'source',
      'type',
      'events.nft.buyer',
      'events.nft.seller',
      'events.nft.saleType',
      'events.nft.amount'
    ]
  };

  export let data;

  // refers only to initialization of page, which means triggering data-initialization in layout
  let isInitialized = false;
  // @TODO do better please...it's too frayed
  let hasSetInitialPaginationSignature = false;

  $: {
    console.log('data: ', data);
  }
  /**
   * UI states
   */
  let showSettings = false;
  let showTaxSummary = true;
  let showTransactions = true;
  let isFetchingTransactions;

  /**
   * Transaction states
   */
  let searchQuery = '';
  let paginationSignature;
  let selectedTransactionTypes;
  let selectedTransactionSources;

  $: ({
    transactionHistory: initialTransactionHistory,
    userProfile,
    hasRemainingCredits
  } = data);
  $: hasInitialTransactionHistory = initialTransactionHistory?.length > 0;

  $: fuse = new Fuse(initialTransactionHistory, fuseOptions);
  $: transactionHistory = (
    searchQuery
      ? fuse.search(searchQuery).map((result) => result.item)
      : initialTransactionHistory
  )
    ?.filter?.((transaction) =>
      selectedTransactionTypes?.length > 0
        ? selectedTransactionTypes?.includes?.(transaction.type)
        : true
    )
    ?.filter?.((transaction) =>
      selectedTransactionSources?.length > 0
        ? selectedTransactionSources?.includes?.(transaction.source)
        : true
    );

  afterUpdate(async () => {
    if ($walletStore$.connected && !userProfile?.walletAddress && !isInitialized) {
      isInitialized = true;
      await invalidateAll();
    } else if ($walletStore$.connected && !userProfile?.walletAddress) {
      isInitialized = true;
    }

    if (!hasSetInitialPaginationSignature && hasInitialTransactionHistory) {
      hasSetInitialPaginationSignature = true;
      paginationSignature =
        initialTransactionHistory?.[initialTransactionHistory.length - 1]?.signature ||
        '';
    }
  });

  const toggleSettings = () => {
    showSettings = !showSettings;
  };

  const toggleTaxSummary = () => {
    showTaxSummary = !showTaxSummary;
  };

  const toggleTransactions = () => {
    showTransactions = !showTransactions;
  };

  const fetchTransactionHistory = async () => {
    isFetchingTransactions = true;

    const response = await fetch(`/api/transaction-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'wallet-address':
          userProfile?.walletAddress || $walletStore$.publicKey?.toString?.() || ''
      },
      body: JSON.stringify({
        address:
          userProfile?.walletAddress || $walletStore$.publicKey?.toString?.() || '',
        paginationSignature: paginationSignature,
        transactionTypes: selectedTransactionTypes,
        transactionSources: selectedTransactionSources
      })
    })
      .then(throwIfHttpError)
      .then(readResponseStreamAsJson)
      .catch((_) => {
        banners$.update((state) => [
          ...state.filter((banner) => banner.bannerId !== ERROR.TRANSACTIONS_FETCH),
          {
            bannerId: ERROR.TRANSACTIONS_FETCH,
            title: 'A problem occurred while fetching your transactions',
            description:
              'Please refresh the page and try again later, or contact support.'
          }
        ]);
      });

    if (response) {
      await invalidateAll();

      paginationSignature = response?.[response.length - 1]?.signature;
      hasSetInitialPaginationSignature = true;

      addNotification({
        ...notifcationSettings,
        text: `${response?.length || 0} Transactions fetched`
      });
    }

    isFetchingTransactions = false;
  };
</script>

<svelte:head>
  <title>Sol and Taxes</title>
  <meta
    name="description"
    content="Calculate tax gains and losses straight from your phantom wallet. Analyze all your transactions and get a detailed report to help with your taxes."
  />
</svelte:head>

<PageContainer>
  <!-- Page header -->
  <svelte:fragment slot="page-header">
    <PageHeader title={'Transactions'}>
      <svelte:fragment slot="primary-action">
        <div class="flex items-center gap-2">
          <!-- Search -->
          {#if hasInitialTransactionHistory}
            <div
              class="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end"
            >
              <div class="w-full max-w-lg lg:max-w-xs">
                <label
                  for="search"
                  class="sr-only">Search</label
                >
                <div class="relative">
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <MagnifyingGlassIcon />
                  </div>
                  <input
                    bind:value={searchQuery}
                    id="search"
                    name="search"
                    class="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>
          {/if}

          <!-- More actions -->
          <Popover let:open>
            <PopoverButton>
              <button
                type="button"
                class="inline-flex gap-1 items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                More actions
                <ChevronDownIcon extraClasses="text-gray-700 h-3.5 w-3.5" />
              </button>
            </PopoverButton>

            {#if open}
              <PopoverPanel
                let:close
                as="div"
              >
                <div
                  transition:slide
                  class="absolute divide-y max-lg:right-0 max-sm:left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabindex="-1"
                >
                  <button
                    on:click={toggleSettings}
                    on:click={() => close(null)}
                    class="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    {showSettings ? `Hide settings` : `Show settings`}
                  </button>
                  {#if hasInitialTransactionHistory}
                    <button
                      on:click={toggleTaxSummary}
                      on:click={() => close(null)}
                      class="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {showTaxSummary ? `Hide tax report` : `Show tax report`}
                    </button>
                    <button
                      on:click={toggleTransactions}
                      on:click={() => close(null)}
                      class="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      {showTransactions ? `Hide transactions` : `Show transactions`}
                    </button>
                  {/if}
                </div>
              </PopoverPanel>
            {/if}
          </Popover>

          <!-- Primary CTA -->
          {#if isFetchingTransactions}
            <button
              disabled
              type="button"
              class="inline-flex gap-1 disabled:opacity-50 items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <LoadingButtonSpinnerIcon />

              Fetch transactions
            </button>
          {:else if !userProfile?.walletAddress}
            <button
              disabled
              type="button"
              class="inline-flex gap-1 disabled:opacity-50 items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Fetch transactions
            </button>
          {:else if !hasRemainingCredits}
            <button
              disabled
              type="button"
              class="inline-flex gap-1 disabled:opacity-50 items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Out of credits
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
        </div>
      </svelte:fragment>
    </PageHeader>
  </svelte:fragment>

  <!-- Page content -->
  <svelte:fragment slot="page-content">
    {#if showSettings || !hasRemainingCredits}
      <div transition:slide>
        <TransactionsSettings
          bind:paginationSignature
          bind:selectedTransactionTypes
          bind:selectedTransactionSources
          {userProfile}
        />
      </div>
    {/if}

    {#if showTaxSummary && hasInitialTransactionHistory}
      <div transition:slide>
        <TaxSummary {transactionHistory} />
      </div>
    {/if}

    {#if hasInitialTransactionHistory && showTransactions}
      <TransactionsTimeline {transactionHistory} />
    {:else if !hasInitialTransactionHistory}
      <EmptyState
        {fetchTransactionHistory}
        {isFetchingTransactions}
        {userProfile}
      />
    {/if}
  </svelte:fragment>
</PageContainer>
