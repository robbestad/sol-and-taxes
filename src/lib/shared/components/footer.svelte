<script lang="ts">
  import GithubIcon from '../icons/github-icon.svelte';
  import { githubLink } from '../shared.constant';
</script>

<footer class="bottom-0 bg-white">
  <div class="mx-auto max-w-7xl overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
    <!-- <nav class="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
      <div class="px-5 py-2">
        <a href="/about" class="text-base text-gray-500 hover:text-gray-900">About</a>
      </div>
    </nav> -->
    <div class="mt-8 flex justify-center space-x-6">
      <a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        class="text-gray-400 hover:text-gray-500"
      >
        <span class="sr-only">Github</span>
        <GithubIcon extraClasses="h-6 w-6" />
      </a>
    </div>
    <p class="mt-5 text-center text-base text-gray-400">
      &copy; Copyright 2023. All rights reserved.
    </p>
  </div>
</footer>
