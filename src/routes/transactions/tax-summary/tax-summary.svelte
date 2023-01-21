<script lang="ts">
  import { LAMPORTS_PER_SOL } from '@solana/web3.js';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import { DateTime } from 'luxon';
  import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';
  import { getNotificationsContext } from 'svelte-notifications';

  import { TRANSACTION_TYPE } from '$lib/shared/shared.type';
  import { unixTimestampToDate, shortenLongWord } from '$lib/shared/shared-utils';
  import { SOL_USD_DAILY_AVERAGE_2021 } from '$lib/shared/price-reference/sol-usd-daily-average-2021.constant';
  import { SOL_USD_DAILY_AVERAGE_2022 } from '$lib/shared/price-reference/sol-usd-daily-average-2022.constant';
  import { SOL_USD_DAILY_AVERAGE_2023 } from '$lib/shared/price-reference/sol-usd-daily-average-2023.constant';
  import { notifcationSettings } from '$lib/shared/shared.constant';
  import DocumentDuplicateIcon from '$lib/shared/icons/document-duplicate-icon.svelte';

  const { addNotification } = getNotificationsContext();

  export let transactionHistory;

  let showDetails = false;

  $: numberOfTransactions = transactionHistory?.length || 0;
  $: saleTransactions = transactionHistory?.filter?.((transaction) => {
    const isSale = transaction?.type === TRANSACTION_TYPE.NFT_SALE;
    const amount = transaction?.events?.nft?.amount * LAMPORTS_PER_SOL;
    const hasBuyer = transaction?.events?.nft?.buyer;
    const hasSeller = transaction?.events?.nft?.seller;
    const isSeller =
      $walletStore$.publicKey?.toString() === transaction?.events?.nft?.seller;

    return isSale && amount > 0 && hasBuyer && hasSeller && isSeller;
  });

  $: capitalGains = saleTransactions?.map?.((transaction) => {
    const amount = transaction?.events?.nft?.amount / LAMPORTS_PER_SOL;
    const timestamp = transaction?.timestamp;
    const signature = transaction?.signature;
    const isoDate = DateTime.fromISO(
      unixTimestampToDate(timestamp).toISOString()
    ).toISODate();
    const is2023 = isoDate.includes('2023');
    const is2022 = isoDate.includes('2022');
    const is2021 = isoDate.includes('2021');
    // SUPER BASIC price lookup
    const usdPrice = Number(
      is2023
        ? SOL_USD_DAILY_AVERAGE_2023[isoDate]
        : is2022
        ? SOL_USD_DAILY_AVERAGE_2022[isoDate]
        : is2021
        ? SOL_USD_DAILY_AVERAGE_2021[isoDate]
        : 0
    );
    const usdGains = (amount * usdPrice).toFixed(2);

    return {
      amount,
      isoDate,
      usdPrice,
      usdGains,
      signature,
      shortenedSignature: shortenLongWord(signature, 8, 5)
    };
  });

  $: totalCapitalGains = capitalGains
    ?.reduce?.((acc, { usdGains }) => acc + Number(usdGains), 0)
    ?.toFixed(2);

  const toggleExpandDetails = () => {
    showDetails = !showDetails;
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);

    addNotification({
      ...notifcationSettings,
      text: 'Copied'
    });
  };
</script>

<h3 class="text-3xl mb-5 font-medium leading-6 text-gray-900">Tax summary</h3>

<section class="mb-10">
  <!-- Summary -->
  <div class="border-b border-gray-200 bg-white py-5">
    <div class="flex flex-col gap-4">
      <p class="text-gray-500">
        Tax calculations are still experimental and are not official and definitely may
        not be correct. Calculations do not include adjusted cost basis or losses at
        this time. Please consult a tax professional for assistance.
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
          {saleTransactions?.length} sales
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
            <p class="text-sm text-gray-500">${totalCapitalGains}</p>
          </div>
        </div>
      </div>

      {#if showDetails}
        <div
          transition:slide
          class="py-4 px-4"
        >
          <div class="flex-1 space-y-1">
            {#each capitalGains as { amount, isoDate, usdPrice, usdGains, signature, shortenedSignature }}
              <div class="flex items-center justify-between">
                <p class="flex gap-1 text-sm text-gray-500">
                  <button
                    on:click|stopPropagation={() => copyToClipboard(signature)}
                    class="flex gap-1 items-center text-sm text-gray-500 hover:text-blue-400"
                  >
                    {shortenedSignature}
                    <DocumentDuplicateIcon extraClasses="h-3 w-3" />
                  </button>
                  for {amount} SOL on {isoDate}
                </p>
                <p class="text-sm text-gray-500">${usdGains}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </li>

    <!-- More items... -->
  </ul>
</section>
