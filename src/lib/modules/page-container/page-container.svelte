<script lang="ts">
  import Footer from '$lib/shared/components/footer.svelte';
  import Banners from '../banners/banners.svelte';
  import Navbar from '$lib/modules/navbar/navbar.svelte';

  /**
   * This component exists mainly because +layout.svelte does not support named slots.
   *
   * https://github.com/sveltejs/kit/issues/627
   */
  export let user = {};
  export let showNavbar = true;
</script>

{#if showNavbar}
  <Navbar {user} />
{/if}

{#if $$slots['page-header']}
  <div class="mb-4">
    <slot name="page-header" />
  </div>
{/if}

<!-- Content  -->
<main class="min-h-[70vh] overflow-scroll">
  <div class="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
    <Banners />
    <slot name="page-content" />
  </div>
</main>

<Footer />
