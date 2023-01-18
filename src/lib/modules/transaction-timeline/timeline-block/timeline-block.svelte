<script lang="ts">
  import { DateTime } from 'luxon';

  import GitCommitIcon from '$lib/shared/icons/git-commit-icon.svelte';
  import TransactionsBlock from './transactions-block.svelte';

  export let dailyBlock;

  // https://daveceddia.com/svelte-reactive-destructuring/
  // $: ({ isoDate, transactions } = dailyBlock);
  const { isoDate, transactions } = dailyBlock;

  const formattedDate = DateTime.fromISO(isoDate).toLocaleString(DateTime.DATE_MED);

  // $: {
  //   console.log('')
  //   console.log('isoDate', isoDate);
  //   console.log('DateTime.fromISO(isoDate): ', DateTime.fromISO(isoDate));
  //   console.log('DateTime.fromISO(isoDate).toLocaleString(DateTime.DATE_MED): ', DateTime.fromISO(isoDate).toLocaleString(DateTime.DATE_MED));
  //   console.log('formattedDate: ', formattedDate);
  // }
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
        <div class="flex w-10 items-center justify-center rounded-full bg-white ring-0">
          <GitCommitIcon extraClasses="text-gray-500" />
          <!-- <HorizontalRuleIcon extraClasses="text-gray-500" /> -->
        </div>
      </div>

      <!-- Cards -->
      <div class="flex flex-col w-full">
        <div class="min-w-0 flex-1 mb-1.5">
          <div class="text-sm text-gray-500">{formattedDate}</div>
        </div>
        <TransactionsBlock />
      </div>
    </div>
  </div>
</li>
