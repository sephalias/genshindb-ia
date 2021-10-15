<template>
  <JsonViewSkeleton v-if="isLoading" />
  <div id="jsonView" class="card m-1">
    <VueJsonPretty
      class="p-1"
      :data="data"
      :deep="2"
      :showLength="true"
      v-if="!isLoading"
    >
    </VueJsonPretty>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
export default {
  components: {
    VueJsonPretty,
    JsonViewSkeleton: defineAsyncComponent(() =>
      import("@/components/home/JsonViewSkeleton")
    ),
  },
  props: {
    data: JSON,
    isLoading: Boolean,
  },
};
</script>

<style></style>
