<template>
  <div id="code" class="card m-1" v-if="code">
    <pre><code data-lang="JavaScript">{{ code }}</code></pre>
  </div>
</template>

<script>
export default {
  props: {
    code: String,
  },
};
</script>

<style></style>
