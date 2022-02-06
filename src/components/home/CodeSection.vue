<template>
  <div id="code" class="card m-1" v-if="code">
    <button
      class="copy-btn btn btn-primary btn-xsmall mb-1 mr-1"
      @click="copyToClipboard(code)"
    >
      Copy
    </button>
    <pre><code class="p-1 pt-4" data-lang="JavaScript">{{ code }}</code></pre>
  </div>
</template>

<script>
export default {
  props: {
    code: String,
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  opacity: 30%;
}
.copy-btn:hover {
  opacity: 100%;
}
</style>
