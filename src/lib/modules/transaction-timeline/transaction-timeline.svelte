<script lang="ts">
  import { transactionHistoryByDay$ } from '$lib/shared/shared.store';

  import TimelineBlock from './timeline-block/timeline-block.svelte';
</script>

<ul>
  {#each $transactionHistoryByDay$ as dailyBlock}
    <TimelineBlock {dailyBlock} />
  {/each}
</ul>
