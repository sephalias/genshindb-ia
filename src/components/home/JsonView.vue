<template>
  <div class="card m-1 p-2">
    <div class="u-flex u-justify-space-between mb-1">
      <p class="title m-0">Result Data</p>
      <div class="form-ext-control mx-1 u-pull-right" v-if="!isLoading">
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
    </div>
    <JsonViewSkeleton v-if="isLoading" />
    <div id="jsonView" v-else>
      <VueJsonPretty
        class="p-1"
        :data="dataFiltered"
        :deep="2"
        :showLength="true"
      >
      </VueJsonPretty>
    </div>
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
      import("@/components/home/JsonViewSkeleton.vue")
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
