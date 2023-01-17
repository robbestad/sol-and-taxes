<script lang="ts">
  import { goto } from '$app/navigation';
  import { logoCdnLnk } from '$lib/shared/shared.constant';
</script>

<div class="flex items-center">
  <button
    on:click={() => {
      goto('/');
    }}
    class="flex-shrink-0"
  >
    <div class="flex justify-center items-center gap-2">
      <img
        class="h-8 w-8"
        src={logoCdnLnk}
        alt="Your Company"
      />
      <span class="text-xl font-medium text-white"> Sol and Taxes </span>
    </div>
  </button>
  <div class="hidden md:block">
    <div class="ml-10 flex items-baseline space-x-4">
      <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
      <a
        href="/projects"
        class="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 active:bg-gray-900"
        aria-current="page">Projects</a
      >
      <a
        href={'/usage'}
        class="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 active:bg-gray-900"
      >
        Usage
      </a>
      <a
        href={'/plans'}
        class="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 active:bg-gray-900"
      >
        Plans
      </a>
    </div>
  </div>
</div>
