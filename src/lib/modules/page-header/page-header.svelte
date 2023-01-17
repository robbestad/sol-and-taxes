<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import BreadcrumbDivider from '$lib/shared/icons/breadcrumb-divider.svelte';

  export let title = '';
  export let breadcrumbs = [] as any;

  let hasBreadcrumbs = breadcrumbs?.length > 0;

  const handleRefresh = async () => {
    await invalidateAll();
  };
</script>

<header class="bg-white border border-gray-200">
  <div
    class="mx-auto flex max-sm:flex-wrap max-sm:h-20 justify-between items-center max-w-6xl px-4 h-14 sm:px-6 lg:px-8"
  >
    <nav
      class="flex"
      aria-label="Breadcrumb"
    >
      <ol class="flex items-center space-x-4">
        {#if hasBreadcrumbs}
          {#each breadcrumbs as { content, url }, index}
            <li>
              <div class="flex items-center">
                {#if index !== 0}
                  <BreadcrumbDivider />
                {/if}
                <a
                  href={url}
                  class="ml-4 text-md font-medium text-gray-500 hover:text-gray-700"
                >
                  {content}
                </a>
              </div>
            </li>
          {/each}
        {/if}

        <li>
          <div class="flex items-center">
            {#if hasBreadcrumbs}
              <BreadcrumbDivider />
            {/if}
            <button
              on:click={handleRefresh}
              class="ml-4 text-xl text-left font-medium text-gray-700 truncate text-ellipsis w-32 sm:w-48 md:w-64 lg:w-96"
            >
              {title}
            </button>
          </div>
        </li>
      </ol>
    </nav>

    <slot name="primary-action" />
  </div>
</header>
