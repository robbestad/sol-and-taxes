<script lang="ts">
  import { workSpace as workSpace$ } from '@svelte-on-solana/wallet-adapter-ui';
  import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';
  import {
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL
  } from '@solana/web3.js';

  import MultiSelect from '$lib/shared/form/multi-select.svelte';
  import {
    TRANSACTION_SOURCE_OPTIONS,
    TRANSACTION_TYPE_OPTIONS
  } from '$lib/shared/shared.constant';
  import { onMount } from 'svelte';

  export let userProfile;
  export let paginationSignature;
  export let selectedTransactionTypes;
  export let selectedTransactionSources;

  $: ({ walletAddress, credits } = userProfile || {});

  // const buyMoreStuff = async () => {
  //   const connection = $workSpace$.connection;
  //   const fromPubkey = $walletStore$.publicKey;
  //   const toPubkey = new PublicKey('76d9ReYnFSYJWc5MGniWSU6XAkj95hrUTMscrL7eTsH8');
  //   const price = LAMPORTS_PER_SOL / 10;

  //   if (fromPubkey && toPubkey && $walletStore$ && $walletStore$.signTransaction) {
  //     let transaction = new Transaction();

  //     transaction.feePayer = fromPubkey;
  //     transaction.add(
  //       SystemProgram.transfer({
  //         fromPubkey,
  //         toPubkey,
  //         lamports: price
  //       })
  //     );

  //     const blockhashResponse = await connection.getLatestBlockhash('finalized');
  //     transaction.recentBlockhash = await blockhashResponse.blockhash;

  //     const signed = await $walletStore$.signTransaction(transaction);
  //     const signature = await connection.sendRawTransaction(signed.serialize());
  //     const confirmed = await connection.confirmTransaction({
  //       blockhash: blockhashResponse.blockhash,
  //       lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
  //       signature: signature
  //     });
  //     const confirmedSlot = confirmed.context.slot;

  //     console.log('confirmed: ', confirmed);
  //     console.log('confirmedSlot: ', confirmedSlot);
  //   }
  // };
</script>

<div class="pb-5 mb-5 w-full">
  <div class="mt-3 flex flex-col gap-4 sm:mt-0 sm:ml-4">
    <!-- Credits -->
    <div class="flex gap-3">
      <div
        class="overflow-hidden w-full sm:w-1/2 rounded-lg bg-white px-4 py-5 border border-gray-200 shadow-sm sm:p-6"
      >
        <dt class="truncate text-sm font-medium text-gray-500">Credits remaining</dt>
        <dd class="mt-1  text-3xl font-semibold tracking-tight text-gray-900">
          {credits}
        </dd>
      </div>
      <div
        class="overflow-hidden w-full sm:w-1/2 rounded-lg bg-white px-4 py-5 border border-gray-200 shadow-sm sm:p-6"
      >
        <dd class="mt-1 text-sm tracking-tight text-gray-500">
          Fetching transactions uses 100 credits and returns ~80 transactions each time.
          1,000 credits costs 0.1 SOL.
        </dd>
        <button
          type="button"
          class="inline-flex mt-2 items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Buy 1,000 credits
        </button>
      </div>
    </div>

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
        <option selected>{walletAddress}</option>
      </select>
    </div>

    <!-- Last transaction -->
    <div>
      <label
        for="paginationSignature"
        class="block text-sm font-medium text-gray-700"
      >
        Last transaction signature
      </label>
      <div class="mt-1">
        <input
          bind:value={paginationSignature}
          type="text"
          name="paginationSignature"
          id="paginationSignature"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          aria-describedby="pagination-signature"
        />
      </div>
      <span>
        <small class="text-gray-500">
          Only transactions before this signature will be fetched. Leave blank to fetch
          latest transactions.
        </small>
      </span>
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
      <span>
        <small class="text-gray-500"> Filters existing transactions by type. </small>
      </span>
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
      <span>
        <small class="text-gray-500"> Filters existing transactions by source. </small>
      </span>
    </div>
  </div>
</div>
