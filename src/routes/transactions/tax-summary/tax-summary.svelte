<script lang="ts">
  import { slide } from 'svelte/transition';

  export let transactionHistory;

  let showDetails = false;

  $: numberOfTransactions = transactionHistory?.length || 0;

  const toggleExpandDetails = () => {
    showDetails = !showDetails;
  };
</script>

<h3 class="text-3xl mb-5 font-medium leading-6 text-gray-900">Tax Summary</h3>

<section class="mb-10">
  <!-- Summary -->
  <div class="border-b border-gray-200 bg-white py-5">
    <div class="flex flex-col gap-4">
      <p class="text-gray-500">
        Hello hello Hello hello Hello hello Hello hello Hello hello Hello hello Hello
        hello Hello hello Hello hello Hello hello
      </p>

      <div class="flex gap-2">
        <span
          class="flex justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
        >
          {numberOfTransactions} transactions
        </span>
        <span
          class="flex justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
        >
          {numberOfTransactions} transactions
        </span>
      </div>
    </div>
  </div>

  <!-- Details -->

  <ul class="divide-y divide-gray-200">
    <li
      on:click={toggleExpandDetails}
      on:keydown={() => {}}
      class="py-4 hover:bg-gray-50 hover:cursor-pointer"
    >
      <div class="flex space-x-3">
        <div class="flex-1 space-y-1 px-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium">Capital gains</h3>
            <p class="text-sm text-gray-500">1h</p>
          </div>
        </div>
      </div>

      {#if showDetails}
        <div
          transition:slide
          class="py-4 px-4"
        >
          <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-500">Includes sales of NFTs and tokens.</p>
              <p class="text-sm text-gray-500">1h</p>
            </div>
          </div>
        </div>
      {/if}
    </li>

    <!-- More items... -->
  </ul>
</section>
