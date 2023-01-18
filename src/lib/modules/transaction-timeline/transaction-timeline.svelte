<script lang="ts">
  import { transactionHistoryByDay$ } from '$lib/shared/shared.store';

  import TimelineBlock from './timeline-block/timeline-block.svelte';

  $: {
    console.log('dailyBlocks: ', $transactionHistoryByDay$);
  }
</script>

<ul>
  <TimelineBlock />
  <TimelineBlock />
</ul>
