<template>
  <div id="jsonView" class="card m-1">
    <div
      v-if="isLoading"
      class="u-flex u-items-center u-justify-center"
      style="background: linear-gradient(to right, rgb(142, 45, 226), rgb(74, 0, 224));"
    >
      <div class="animated loading hide-text loading-white">
        <p>Hidden</p>
      </div>
    </div>
    <VueJsonPretty class="p-1" :data="data" :deep="2" :showLength="true" v-else>
    </VueJsonPretty>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
export default {
  components: {
    VueJsonPretty,
  },
  props: {
    data: JSON,
    isLoading: Boolean,
  },
};
</script>

<style></style>
