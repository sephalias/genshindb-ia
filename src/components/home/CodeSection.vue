<template>
  <div id="code" class="card m-1" v-if="code">
    <div class="content p-2 mb-0">
      <div class="u-flex u-justify-space-between mb-1">
        <p class="title m-0">JavaScript Code</p>
        <button
          class="btn btn-primary btn--xs m-0"
          @click="copyToClipboard(code)"
        >
          <div class="u-flex">
            <span class="mr-1">Copy</span><ClipboardCopy size="21px" />
          </div>
        </button>
      </div>
      <pre><code class="p-1 pt-4" data-lang="JavaScript">{{ code }}</code></pre>
    </div>
  </div>
</template>

<script>
import { ClipboardCopy } from "lucide-vue-next";

export default {
  props: {
    code: String,
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
