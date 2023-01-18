<script lang="ts">
  import GitCommitIcon from '$lib/shared/icons/git-commit-icon.svelte';
  import TransactionsBlock from './transactions-block.svelte';
</script>

<li>
  <div class="relative pb-8">
    <span
      class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
      aria-hidden="true"
    />
    <div class="relative flex items-start space-x-3">
      <div class="relative">
        <div class="flex w-10 items-center justify-center rounded-full bg-white ring-0">
          <GitCommitIcon extraClasses="text-gray-500" />
          <!-- <HorizontalRuleIcon extraClasses="text-gray-500" /> -->
        </div>
      </div>
      <div class="flex flex-col w-full">
        <div class="min-w-0 flex-1 py-1.5">
          <div class="text-sm text-gray-500">
            <a
              href="#"
              class="font-medium text-gray-900">Hilary Mahy</a
            >
            assigned
            <a
              href="#"
              class="font-medium text-gray-900">Kristin Watson</a
            >
            <span class="whitespace-nowrap">2d ago</span>
          </div>
        </div>
        <TransactionsBlock />
      </div>
    </div>
  </div>
</li>
