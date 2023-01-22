<script lang="ts">
  import { workSpace as workSpace$ } from '@svelte-on-solana/wallet-adapter-ui';
  import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';
  import {
    PublicKey,
    SystemProgram,
    Transaction,
    LAMPORTS_PER_SOL
  } from '@solana/web3.js';
  import { getNotificationsContext } from 'svelte-notifications';
  import { invalidateAll } from '$app/navigation';

  import MultiSelect from '$lib/shared/form/multi-select.svelte';
  import LoadingButtonSpinnerIcon from '$lib/shared/icons/loading-button-spinner-icon.svelte';
  import { banners$ } from '$lib/shared/shared.store';
  import { ERROR } from '$lib/shared/shared.type';
  import {
    appWalletAddress,
    notifcationSettings,
    TRANSACTION_SOURCE_OPTIONS,
    TRANSACTION_TYPE_OPTIONS
  } from '$lib/shared/shared.constant';
  import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';

  const { addNotification } = getNotificationsContext();

  export let userProfile;
  export let paginationSignature;
  export let selectedTransactionTypes;
  export let selectedTransactionSources;

  let isBuyingCredits = false;

  $: ({ walletAddress, credits } = userProfile || {});

  const buyMoreCredits = async () => {
    isBuyingCredits = true;

    /**
     * Transaction
     */
    const connection = $workSpace$.connection;
    const fromPubkey = $walletStore$.publicKey;
    const toPubkey = new PublicKey(appWalletAddress);
    const price = LAMPORTS_PER_SOL / 10;

    if (!fromPubkey || !toPubkey || !$walletStore$ || !$walletStore$.signTransaction) {
      isBuyingCredits = false;
      return;
    }

    let transaction = new Transaction();

    transaction.feePayer = fromPubkey;
    transaction.add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: price
      })
    );

    const { blockhashResponse } = await fetch(`/api/rpc/latest-blockhash`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'wallet-address': fromPubkey?.toString?.() || ''
      }
    })
      .then(throwIfHttpError)
      .then(readResponseStreamAsJson)
      .catch((_) => {
        banners$.update((state) => [
          ...state.filter((banner) => banner.bannerId !== ERROR.LATEST_BLOCKHASH_FETCH),
          {
            bannerId: ERROR.LATEST_BLOCKHASH_FETCH,
            title:
              'A problem occurred while purchasing your credits (could not fetch latest blockhash)',
            description: 'Please contact support at ktruong008@gmail.com'
          }
        ]);
      });

    transaction.recentBlockhash = blockhashResponse.blockhash;

    const signed = (await $walletStore$.signTransaction(transaction).catch(() => {
      isBuyingCredits = false;
    })) as any;

    const { confirmed } = await fetch(`/api/rpc/transaction-send-and-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'wallet-address': fromPubkey?.toString?.() || ''
      },
      body: JSON.stringify({
        signedSerialized: signed.serialize(),
        blockhashResponse
      })
    })
      .then(throwIfHttpError)
      .then(readResponseStreamAsJson)
      .catch((_) => {
        banners$.update((state) => [
          ...state.filter(
            (banner) => banner.bannerId !== ERROR.TRANSACTION_SEND_AND_CONFIRM
          ),
          {
            bannerId: ERROR.TRANSACTION_SEND_AND_CONFIRM,
            title:
              'A problem occurred while purchasing your credits (could not send and confirm transaction)',
            description: 'Please contact support at ktruong008@gmail.com'
          }
        ]);
      });

    const confirmedSlot = confirmed.context.slot;

    if (!confirmedSlot) {
      isBuyingCredits = false;
      return;
    }

    /**
     * Add credits to account
     */
    const response = await fetch(`/api/credit-purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'wallet-address': fromPubkey?.toString?.() || ''
      },
      body: JSON.stringify({
        payeeAddress: toPubkey?.toString?.()
      })
    })
      .then(throwIfHttpError)
      .then(readResponseStreamAsJson)
      .catch((_) => {
        banners$.update((state) => [
          ...state.filter((banner) => banner.bannerId !== ERROR.CREDITS_PURCHASE),
          {
            bannerId: ERROR.CREDITS_PURCHASE,
            title: 'A problem occurred while purchasing your credits',
            description: 'Please contact support at ktruong008@gmail.com'
          }
        ]);
      });

    if (response) {
      await invalidateAll();

      addNotification({
        ...notifcationSettings,
        text: `1,000 Credits purchased`
      });
    }

    isBuyingCredits = false;
  };
</script>

<div class="pb-5 mb-5 w-full">
  <div class="mt-3 flex flex-col gap-4 sm:mt-0 sm:ml-4">
    <h3 class="text-3xl font-medium leading-6 text-gray-900">Settings</h3>
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
          Purchases may take up to a minute to process, please do not close the page.
        </dd>
        <button
          on:click={buyMoreCredits}
          disabled={isBuyingCredits}
          type="button"
          class="inline-flex gap-1 disabled:opacity-50 mt-2 items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {#if isBuyingCredits}
            <LoadingButtonSpinnerIcon extraClasses="text-gray-500" /><span
              >Purchasing...</span
            >
          {:else}
            Buy 1,000 credits for 0.1 SOL
          {/if}
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
