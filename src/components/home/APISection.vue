<template>
  <div id="code" class="card m-1" v-if="link">
    <div class="content p-2 mb-0">
      <div class="u-flex u-justify-space-between">
        <p class="title m-0">API Link</p>
        <button
          class="btn btn-primary btn--xs mb-1 mr-1"
          @click="copyToClipboard(link)"
        >
          <div class="u-flex">
            <span class="mr-1">Copy</span><ClipboardCopy size="21px" />
          </div>
        </button>
      </div>
      <pre><code class="p-1">{{ link }}</code></pre>
    </div>
  </div>
</template>

<script>
import { ClipboardCopy } from "lucide-vue-next";

export default {
  props: {
    link: String,
  },
  components: {
    ClipboardCopy,
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard.writeText(text);
    },
  },
};
</script>
