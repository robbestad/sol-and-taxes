<script lang="ts">
  import { slide } from 'svelte/transition';
  import { getNotificationsContext } from 'svelte-notifications';
  import { DateTime } from 'luxon';
  import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';

  import {
    lamportsToSol,
    shortenLongWord,
    shortenLongWordsWithin,
    tagTransaction,
    unixTimestampToDate
  } from '$lib/shared/shared-utils';
  import SolLogoIcon from '$lib/shared/icons/sol-logo-icon.svelte';
  import DocumentDuplicateIcon from '$lib/shared/icons/document-duplicate-icon.svelte';
  import { notifcationSettings } from '$lib/shared/shared.constant';
  import { TRANSACTION_TAG } from '$lib/shared/shared.type';

  const { addNotification } = getNotificationsContext();

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

  /**
   * Tags
   */
  $: tags = tagTransaction(transaction, $walletStore$?.publicKey?.toString?.());

  const toggleExpandDetails = () => {
    isExpanded = !isExpanded;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);

    addNotification({
      ...notifcationSettings,
      text: 'Copied'
    });
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
          {@const isNftPurchaseTag = tag === TRANSACTION_TAG.NFT_PURCHASE}
          {@const isNftSaleTag = tag === TRANSACTION_TAG.NFT_SALE}
          {@const isUnknownTag = tag === TRANSACTION_TAG.UNKNOWN}
          <p
            class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
            class:bg-gray-100={isUnknownTag}
            class:text-gray-800={isUnknownTag}
            class:bg-green-100={isNftSaleTag}
            class:text-green-800={isNftSaleTag}
            class:bg-blue-100={isNftPurchaseTag}
            class:text-blue-800={isNftPurchaseTag}
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
          <span class="text-sm text-gray-500 flex gap-1">
            <span class="font-bold"> Buyer: </span>
            {#if nftBuyer}
              <button
                on:click|stopPropagation={() => copyToClipboard(nftBuyer)}
                class="flex gap-1 items-center text-sm text-gray-500 hover:text-blue-400"
              >
                {nftBuyer}
                <DocumentDuplicateIcon extraClasses="h-3 w-3" />
              </button>
            {:else}
              –
            {/if}
          </span>
          <span class="text-sm text-gray-500 flex gap-1">
            <span class="font-bold">Seller:</span>
            {#if nftSeller}
              <button
                on:click|stopPropagation={() => copyToClipboard(nftSeller)}
                class="flex gap-1 items-center text-sm text-gray-500 hover:text-blue-400"
              >
                {nftSeller}
                <DocumentDuplicateIcon extraClasses="h-3 w-3" />
              </button>
            {:else}
              –
            {/if}
          </span>

          <span class="text-sm text-gray-500 flex gap-1">
            <span class="font-bold"> Signature: </span>

            <button
              on:click|stopPropagation={() => copyToClipboard(signature)}
              class="flex gap-1 items-center text-sm text-gray-500 hover:text-blue-400"
            >
              {shortenedSignature}
              <DocumentDuplicateIcon extraClasses="h-3 w-3" />
            </button>
          </span>
        </div>
      </div>
    </div>
  {/if}
</button>
