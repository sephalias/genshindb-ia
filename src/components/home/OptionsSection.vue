<script setup lang="ts">
import { getDefaultOptions, getLanguages } from "@/scripts/api";
import { useOptionsStore } from "@/stores/options";
import { Reload } from "@vicons/ionicons5";
import { useNotification } from "naive-ui";
import { computed, onMounted, ref } from "vue";

const env = import.meta.env.MODE;

const optionsStore = useOptionsStore().$state;
const notification = useNotification();

const isLoading = ref(false);
const languages = getLanguages();

onMounted(() => {
  isLoading.value = false;
});

// FIXME: matchNames description
const optionsDescriptions = computed({
  get() {
    return {
      dumpResult:
        "The query result will return an object with the properties: query, folder, match, options, filename, result.",
      matchNames: "Allows the matching of names.",
      matchAltNames: "Allows the matching of alternate or custom names.",
      matchAliases:
        "Allows the matching of aliases. These are searchable fields that returns the data object the query matched in.",
      matchCategories:
        "Allows the matching of categories. If true, then returns an array if it matches.",
      verboseCategories:
        "Used if a category is matched. If true, then replaces each string name in the array with the data object instead.",
      queryLanguages: "Array of languages that your query will be searched in.",
      resultLanguage: "Output language that you want your results to be in.",
    };
  },
  set() {},
});

const languageOptions = computed({
  get() {
    let lang: any = [];
    languages.forEach((element: string) => {
      lang.push({ value: element, label: element, disabled: false });
    });
    return lang;
  },
  set() {},
});

function resetOptions() {
  useOptionsStore().$patch({ ...getDefaultOptions() });
  notification.info({
    content: "Options reset.",
    duration: 2500,
    title: "Info",
  });
}
</script>

<template>
  <n-space id="options" vertical>
    <n-divider>Options</n-divider>
    <n-grid x-gap="12" cols="2 100:1 280:1 360:1 400:2">
      <n-gi>
        <n-space vertical>
          <div
            v-for="(value, index) in optionsStore"
            :key="index"
            :id="index.toString()"
          >
            <n-space v-if="typeof value == 'boolean'">
              <n-switch v-model:value="optionsStore[index]" />
              <n-tooltip trigger="hover">
                <template #trigger> {{ index }} </template>
                {{ (optionsDescriptions as any)[index] }}
              </n-tooltip>
            </n-space>
          </div>
        </n-space>
      </n-gi>
      <n-gi>
        <n-space vertical>
          <n-space vertical>
            Result Language
            <n-select
              v-model:value="optionsStore['resultLanguage']"
              virtual-scroll
              :default-value="getDefaultOptions()['resultLanguage']"
              :options="languageOptions"
            />
          </n-space>
          <n-space vertical>
            Query Language
            <n-select
              v-model:value="optionsStore['queryLanguages']"
              multiple
              clearable
              :default-value="getDefaultOptions()['queryLanguages']"
              :options="languageOptions"
            />
          </n-space>
          <n-button text type="info" @click="resetOptions">
            <template #icon>
              <n-icon>
                <Reload />
              </n-icon>
            </template>
            Reset Options
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>
    <n-alert
      title="Development Mode"
      type="warning"
      v-if="env === 'development'"
    >
      <n-space>
        <n-code
          language="json"
          :code="JSON.stringify(optionsStore)"
          word-wrap
        />
      </n-space>
    </n-alert>
  </n-space>
</template>

<style></style>
