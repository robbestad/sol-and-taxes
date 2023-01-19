<script>
  import { getNotificationsContext } from 'svelte-notifications';

  import PageContainer from '$lib/modules/page-container/page-container.svelte';
  import PageHeader from '$lib/modules/page-header/page-header.svelte';
  import TransactionTimeline from '$lib/modules/transaction-timeline/transaction-timeline.svelte';
  import MiniPlusIcon from '$lib/shared/icons/mini-plus-icon.svelte';
  import { readResponseStreamAsJson, throwIfHttpError } from '$lib/shared/shared-utils';
  import { transactionHistory$ } from '$lib/shared/shared.store';
  import { notifcationSettings } from '$lib/shared/shared.constant';

  const { addNotification } = getNotificationsContext();

  export let data;

  let isLoading;
</script>

<PageContainer>
  

  <svelte:fragment slot="page-content">
    <div>
            <h1 class="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">Data to enrich your online business</h1>
            <p class="mt-6 text-lg leading-8 text-gray-600 sm:text-center">Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.</p>
            <div class="mt-8 flex gap-x-4 sm:justify-center">
              <a href="#" class="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700">
                Get started
                <span class="text-indigo-200" aria-hidden="true">&rarr;</span>
              </a>
              <a href="#" class="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Live demo
                <span class="text-gray-400" aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
    
  </svelte:fragment>
</PageContainer>
