<script lang="ts">
  import { slide } from 'svelte/transition';
  import { DateTime } from 'luxon';

  import {
    lamportsToSol,
    shortenLongWord,
    shortenLongWordsWithin,
    signatureToSolscanLink,
    tagTransaction,
    unixTimestampToDate
  } from '$lib/shared/shared-utils';
  import SolLogoIcon from '$lib/shared/icons/sol-logo-icon.svelte';
  import ArrowTopRightOnSquareIcon from '$lib/shared/icons/arrow-top-right-on-square-icon.svelte';

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
  $: shortenedSignature = shortenLongWord(signature, 8, 5);
  $: solAmount = lamportsToSol(events?.nft?.amount);

  /**
   * NFT events
   */
  $: nftSaleType = transaction?.events?.nft?.saleType || '';
  $: nftBuyer = transaction?.events?.nft?.buyer;
  $: nftSeller = transaction?.events?.nft?.seller;
  // Some NFT events look like duplicates but the crap copy is missing the buyer/seller
  $: hasNftBuyerAndSeller = nftBuyer && nftSeller;
  $: isNftPurchase =
    hasNftBuyerAndSeller &&
    transaction?.events?.nft?.buyer === 'CQtTxnRfFYYQm7fvVb91Y8MYHu6P8UhWvxo7KeXe2NP2';
  $: isNftSale =
    hasNftBuyerAndSeller &&
    transaction?.events?.nft?.seller === 'CQtTxnRfFYYQm7fvVb91Y8MYHu6P8UhWvxo7KeXe2NP2';

  /**
   * Tags
   */
  $: tags = tagTransaction(transaction);

  $: {
    console.log('transaction: ', transaction?.description || 'empty', transaction);
  }

  const toggleExpandDetails = () => {
    isExpanded = !isExpanded;
  };
</script>

<button
  on:click={toggleExpandDetails}
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
        {#each tags as tag}
          <p
            class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
          >
            {tag}
          </p>
        {/each}
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
        <div class="flex flex-col gap-1 items-start text-left">
          <span class="mb-3 text-sm text-gray-500">{formattedDescription}</span>
          <span class="text-sm text-gray-500">
            <span class="font-bold">Sale type:</span>
            {nftSaleType || '–'}
          </span>
          <span class="text-sm text-gray-500">
            <span class="font-bold"> Buyer: </span>
            {nftBuyer || '–'}
          </span>
          <span class="text-sm text-gray-500">
            <span class="font-bold">Seller:</span>
            {nftSeller || '–'}
          </span>

          <span class="text-sm text-gray-500 flex gap-1">
            <span class="font-bold"> Signature: </span>

            <a
              on:click|stopPropagation
              href={signatureToSolscanLink(signature)}
              target="_blank"
              rel="noopener noreferrer"
              class="flex gap-1 items-center text-sm text-gray-500 hover:text-blue-400 hover:underline"
            >
              {shortenedSignature}
              <ArrowTopRightOnSquareIcon extraClasses="h-3 w-3" />
            </a>
          </span>
        </div>
      </div>
    </div>
  {/if}
</button>
