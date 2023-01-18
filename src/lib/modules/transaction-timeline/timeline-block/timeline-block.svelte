<script lang="ts">
  import { DateTime } from 'luxon';
  import { slide } from 'svelte/transition';

  import GitCommitIcon from '$lib/shared/icons/git-commit-icon.svelte';
  import HorizontalRuleIcon from '$lib/shared/icons/horizontal-rule-icon.svelte';

  import TransactionsBlock from './transactions-block.svelte';

  export let dailyBlock;

  let isBlockHidden = false;

  $: ({ isoDate, transactions } = dailyBlock);
  $: formattedDate = DateTime.fromISO(isoDate).toLocaleString(DateTime.DATE_MED);

  const toggleBlockVisibility = () => {
    isBlockHidden = !isBlockHidden;
  };
</script>

<li>
  <div class="relative pb-8">
    <!-- Vertical line -->
    <span
      class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
      aria-hidden="true"
    />

    <!-- Content -->
    <div class="relative flex items-start space-x-3">
      <!-- Divider icons -->
      <div class="relative">
        <button
          on:click={toggleBlockVisibility}
          class="flex w-10 items-center justify-center rounded-full bg-white ring-0 hover:cursor-pointer"
        >
          {#if isBlockHidden}
            <HorizontalRuleIcon extraClasses="text-gray-500" />
          {:else}
            <GitCommitIcon extraClasses="text-gray-500" />
          {/if}
        </button>
      </div>

      <!-- Cards -->
      <div class="flex flex-col w-full">
        <div class="min-w-0 flex-1 mb-1.5">
          <div class="text-sm text-gray-500">
            Transactions on {formattedDate}{#if isBlockHidden}...{/if}
          </div>
        </div>
        {#if !isBlockHidden}
          <div transition:slide>
            <TransactionsBlock {transactions} />
          </div>
        {/if}
      </div>
    </div>
  </div>
</li>
