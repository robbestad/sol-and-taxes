<script lang="ts">
  import { DateTime } from 'luxon';

  import {
    shortenLongWordsWithin,
    unixTimestampToDate
  } from '$lib/shared/shared-utils';

  export let transaction;

  $: ({
    description,
    events,
    signature,
    timestamp,
    type: transactionType,
    source: transactionSource,
    accountData,
    instructions
  } = transaction);

  // $: formattedDate = unixTimestampToDate(timestamp)
  // Use DateTime to convert to datetime
  $: transactionTime = DateTime.fromISO(
    unixTimestampToDate(timestamp).toISOString()
  ).toLocaleString(DateTime.TIME_SIMPLE);
  $: formattedDescription = shortenLongWordsWithin(description);

  $: {
    console.log(
      'transaction: ',
      transaction?.description || 'empty',
      transaction?.events,
      transaction
    );
  }
</script>

<button class="block w-full hover:bg-gray-50">
  <div class="px-4 py-4 sm:px-6">
    <div class="flex items-center justify-between">
      <p class="truncate text-sm font-medium text-gray-700">
        <span class="font-bold">{transactionType}</span>
        <span class="text-xs text-gray-500"> from</span>
        <span class="font-bold"> {transactionSource}</span>
        <span class="text-xs text-gray-500"> at</span>
        <span class="text-xs text-gray-500"> {transactionTime}</span>
      </p>
      <div class="ml-2 flex flex-shrink-0">
        <p
          class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
        >
          Full-time
        </p>
      </div>
    </div>
  </div>
</button>
