<script lang="ts">
  import { slide } from 'svelte/transition';
  import { DateTime } from 'luxon';

  import {
    lamportsToSol,
    shortenLongWord,
    shortenLongWordsWithin,
    unixTimestampToDate
  } from '$lib/shared/shared-utils';
  import SolLogoIcon from '$lib/shared/icons/sol-logo-icon.svelte';

  export let transaction;

  let isExpanded = false;

  $: ({
    description,
    events,
    signature,
    timestamp,
    type: transactionType,
    source: transactionSource,
    accountData,
    instructions
  } = transaction);

  // $: formattedDate = unixTimestampToDate(timestamp)
  // Use DateTime to convert to datetime
  $: transactionTime = DateTime.fromISO(
    unixTimestampToDate(timestamp).toISOString()
  ).toLocaleString(DateTime.TIME_SIMPLE);
  $: formattedDescription = shortenLongWordsWithin(description);
  $: shortenedSignature = shortenLongWord(signature);
  $: solAmount = lamportsToSol(events?.nft?.amount);

  $: {
    console.log('transaction: ', transaction?.description || 'empty', transaction);
  }

  const toggleExpand = () => {
    isExpanded = !isExpanded;
  };
</script>

<button
  on:click={toggleExpand}
  class="block w-full hover:bg-gray-50"
>
  <div class="px-4 py-4 sm:px-6">
    <div class="flex items-center justify-between">
      <p class="truncate text-sm font-medium text-gray-700">
        <span class="font-bold">{transactionType}</span>
        <span class="text-xs text-gray-500"> from</span>
        <span class="font-bold"> {transactionSource}</span>
        {#if solAmount}
          <span class="text-xs text-gray-500"> for</span>
          <span class="font-bold">
            <SolLogoIcon />
            {solAmount}</span
          >
        {/if}
        <span class="text-xs text-gray-500"> at</span>
        <span class="text-xs text-gray-500"> {transactionTime}</span>
      </p>
      <div class="ml-2 flex flex-shrink-0">
        <p
          class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
        >
          Full-time
        </p>
      </div>
    </div>
  </div>
  <!-- Expanded transaction details -->
  {#if isExpanded}
    <div
      transition:slide
      class="px-4 py-4 sm:px-6"
    >
      <div class="flex items-center justify-between">
        <div class="flex flex-col items-start">
          <span class="text-sm text-gray-500">{formattedDescription}</span>
          <span class="text-sm text-gray-500">{shortenedSignature}</span>
        </div>

        <!-- Right side stuff -->
        <div class="ml-2 flex flex-shrink-0">
          <p
            class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
          >
            Full-time
          </p>
        </div>
      </div>
    </div>
  {/if}
</button>
