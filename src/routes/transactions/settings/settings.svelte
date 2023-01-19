<script lang="ts">
  import MultiSelect from '$lib/shared/form/multi-select.svelte';

  const ui_libs = ['AF', 'SQ', 'AR', 'HY', 'EU'];
  const bu_libs = ['AF', 'SQ', 'AR', 'HY', 'EU'];

  let selected;
  let selected2;
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

      <MultiSelect bind:value={selected}>
        <option value="AF">Afrikanns</option>
        <option value="SQ">Albanian</option>
        <option value="AR">Arabic</option>
        <option value="HY">Armenian</option>
        <option value="EU">Basque</option>
      </MultiSelect>
    </div>

    <!-- Transaction sources -->
    <div>
      <label
        for="transactionSources"
        class="block text-sm font-medium text-gray-700">Transaction sources</label
      >

      <MultiSelect bind:value={selected2}>
        <option value="AF">Afrikanns</option>
        <option value="SQ">Albanian</option>
        <option value="AR">Arabic</option>
        <option value="HY">Armenian</option>
        <option value="EU">Basque</option>
      </MultiSelect>
    </div>
  </div>
</div>
