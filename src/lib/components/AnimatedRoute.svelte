<script lang="ts">
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";
</script>

<!-- 'key' rebuilds all children whenever the value on the right side changes ($page.url) 
causing the div inside to re-render whenever the URL changes
-->
{#key $page.url}
  <div
    in:fly={{ x: "-100%", duration: 500 }}
    out:fly={{ y: "200%", duration: 50 }}
  >
    <slot />
  </div>
{/key}
