<script lang="ts">
  import TransactionCard from './transaction-card.svelte';
</script>

<div class="min-w-0 flex-1">
  <div class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul class="divide-y divide-gray-200">
      <TransactionCard />
      <TransactionCard />
      <TransactionCard />
    </ul>
  </div>
</div>
