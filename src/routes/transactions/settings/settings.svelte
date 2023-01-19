<script lang="ts">
  import MultiSelect from '$lib/shared/form/multi-select.svelte';
  import {
    TRANSACTION_SOURCE_OPTIONS,
    TRANSACTION_TYPE_OPTIONS
  } from '$lib/shared/shared.constant';

  let selectedTransactionTypes;
  let selectedTransactionSources;
</script>

<div class="pb-5 mb-5 w-full">
  <div class="mt-3 flex flex-col gap-4 sm:mt-0 sm:ml-4">
    <!-- Wallet address -->
    <div>
      <label
        for="walletAddress"
        class="block text-sm font-medium text-gray-700">Wallet address</label
      >
      <select
        id="walletAddress"
        name="walletAddress"
        class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
      >
        <option selected>CQtTxnRfFYYQm7fvVb91Y8MYHu6P8UhWvxo7KeXe2NP2</option>
      </select>
    </div>

    <!-- Transaction types -->
    <div>
      <label
        for="transactionTypes"
        class="block text-sm font-medium text-gray-700">Transaction types</label
      >

      <MultiSelect bind:value={selectedTransactionTypes}>
        {#each TRANSACTION_TYPE_OPTIONS as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </MultiSelect>
    </div>

    <!-- Transaction sources -->
    <div>
      <label
        for="transactionSources"
        class="block text-sm font-medium text-gray-700">Transaction sources</label
      >

      <MultiSelect bind:value={selectedTransactionSources}>
        {#each TRANSACTION_SOURCE_OPTIONS as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </MultiSelect>
    </div>
  </div>
</div>
