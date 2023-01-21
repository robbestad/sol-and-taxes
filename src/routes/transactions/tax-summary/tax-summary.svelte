<script lang="ts">
  export let transactionHistory;

  $: numberOfTransactions = transactionHistory?.length || 0;
</script>

<h3 class="text-3xl mb-5 font-medium leading-6 text-gray-900">Tax Summary</h3>

<section class="mb-10">
  <!-- Summary -->
  <div class="border-b border-gray-200 bg-white py-5">
    <div class="flex flex-col gap-4">
      <p class="text-gray-500">
        Hello hello Hello hello Hello hello Hello hello Hello hello Hello hello Hello
        hello Hello hello Hello hello Hello hello
      </p>

      <div class="flex gap-2">
        <span
          class="flex justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
        >
          {numberOfTransactions} transactions
        </span>
        <span
          class="flex justify-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
        >
          {numberOfTransactions} transactions
        </span>
      </div>
    </div>
  </div>

  <!-- Details -->
  <div>
    <ul
      role="list"
      class="divide-y divide-gray-200"
    >
      <li class="py-4">
        <div class="flex space-x-3">
          <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium">Lindsay Walton</h3>
              <p class="text-sm text-gray-500">1h</p>
            </div>
            <p class="text-sm text-gray-500">
              Deployed Workcation (2d89f0c8 in master) to production
            </p>
          </div>
        </div>
      </li>

      <li class="py-4">
        <div class="flex space-x-3">
          <div class="flex-1 space-y-1">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium">Lindsay Walton</h3>
              <p class="text-sm text-gray-500">1h</p>
            </div>
            <p class="text-sm text-gray-500">
              Deployed Workcation (2d89f0c8 in master) to production
            </p>
          </div>
        </div>
      </li>

      <!-- More items... -->
    </ul>
  </div>
</section>
