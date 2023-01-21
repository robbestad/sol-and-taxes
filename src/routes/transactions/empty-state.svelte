<script lang="ts">
  import LoadingButtonSpinnerIcon from '$lib/shared/icons/loading-button-spinner-icon.svelte';

  export let userProfile;
  export let fetchTransactionHistory;
  export let isFetchingTransactions = false;
</script>

<div class="text-center">
  <svg
    class="mx-auto h-12 w-12 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      vector-effect="non-scaling-stroke"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    />
  </svg>
  <h3 class="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
  <p class="mt-1 text-sm text-gray-500">Get started by fetching transactions.</p>
  <div class="mt-6">
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
    {:else}
      <button
        on:click={fetchTransactionHistory}
        type="button"
        class="inline-flex items-center gap-1 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Fetch transactions
      </button>
    {/if}
  </div>
</div>
