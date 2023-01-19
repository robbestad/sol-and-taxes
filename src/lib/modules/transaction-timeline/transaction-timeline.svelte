<script lang="ts">
  import { DateTime } from 'luxon';

  import { unixTimestampToDate } from '$lib/shared/shared-utils';

  import TimelineBlock from './timeline-block/timeline-block.svelte';

  export let transactionHistory;

  $: transactionHistoryByDay = transactionHistory?.reduce?.((acc, transaction) => {
    const date = unixTimestampToDate(transaction.timestamp);
    const isoDate = DateTime.fromISO(date.toISOString()).toISODate();

    const dayBlock = acc.find((block) => {
      return block.isoDate === isoDate;
    });

    if (dayBlock) {
      dayBlock.transactions.push(transaction);
    } else {
      acc.push({
        isoDate,
        transactions: [transaction]
      });
    }

    return acc;
  }, []);
</script>

<ul>
  {#each transactionHistoryByDay as dailyBlock}
    <TimelineBlock {dailyBlock} />
  {/each}
</ul>
