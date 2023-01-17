<script>
  import PageContainer from '$lib/modules/page-container/page-container.svelte';
  import PageHeader from '$lib/modules/page-header/page-header.svelte';
    import MiniPlusIcon from '$lib/shared/icons/mini-plus-icon.svelte';

  export let data;

  let isLoading;
</script>

<PageContainer>
  <svelte:fragment slot="page-header">
    <PageHeader title={'Projects'}>
      <svelte:fragment slot="primary-action">
        {#if data.projects?.length > 0}
          <button
            on:click={() => {
              console.log('hello');
            }}
            disabled={isLoading || (data.projects.length >= 5 && !data.isPaidUser)}
            type="button"
            class="inline-flex gap-1 disabled:opacity-50 items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <MiniPlusIcon />
            New project
          </button>
        {/if}
      </svelte:fragment>
    </PageHeader>
  </svelte:fragment>

  <svelte:fragment slot="page-content">hello</svelte:fragment>
</PageContainer>
