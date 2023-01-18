<script lang="ts">
  import TransactionCard from './transaction-card.svelte';

  export let transactions;
</script>

<div class="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-md">
  <ul class="divide-y divide-gray-200">
    {#each transactions as transaction}
      <TransactionCard {transaction} />
    {/each}
  </ul>
</div>
