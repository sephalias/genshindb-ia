<template>
  <JsonViewSkeleton v-if="isLoading" />
  <div id="jsonView" class="card m-1" v-else>
    <div class="form-ext-control mx-1 u-pull-right">
      <label class="form-ext-toggle__label"
        ><span>Results</span>
        <div class="form-ext-toggle ml-1">
          <input
            name="toggleCheckbox"
            type="checkbox"
            class="form-ext-input"
            v-model="showResults"
          />
          <div class="form-ext-toggle__toggler"><i></i></div>
        </div>
      </label>
    </div>
    <VueJsonPretty
      class="p-1"
      :data="dataFiltered"
      :deep="2"
      :showLength="true"
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
  data() {
    return { showResults: true };
  },
  props: {
    data: JSON,
    isLoading: Boolean,
  },
  computed: {
    dataFiltered() {
      let data = this.data;
      try {
        if (data["options"]["dumpResult"])
          if (this.showResults) data = data.result;
      } catch {
        if (this.showResults) return data;
        else data = null;
      }
      return data;
    },
  },
};
</script>

<style></style>
