<script>
  import { fade } from 'svelte/transition';
  import { WalletMultiButton } from '@svelte-on-solana/wallet-adapter-ui';
  import { walletStore as walletStore$ } from '@svelte-on-solana/wallet-adapter-core';

  import PageContainer from '$lib/modules/page-container/page-container.svelte';

  export let data;
</script>

<PageContainer>
  <svelte:fragment slot="page-content">
    <div class="isolate bg-white">
      <main class="relative">
        <div
          class="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        >
          <svg
            class="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
              fill-opacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#9089FC" />
                <stop
                  offset="1"
                  stop-color="#FF80B5"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="relative px-6 lg:px-8">
          <div class="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
            <div>
              <div>
                <h1
                  class="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl"
                >
                  Calculate crypto taxes straight from your wallet
                </h1>
                <p class="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                  Connect your wallet and calculate capital gains from all your
                  transactions.
                </p>
                <div class="mt-8 flex gap-x-4 sm:justify-center">
                  <WalletMultiButton />
                  {#if $walletStore$.connected && $walletStore$?.publicKey}
                    <a
                      transition:fade
                      href="/transactions"
                      class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                    >
                      Get started
                      <span
                        class="text-indigo-200"
                        aria-hidden="true">&rarr;</span
                      >
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </svelte:fragment>
</PageContainer>
