<script setup lang="ts">
import { getDefaultOptions, getUrl } from "@/scripts/api";
import { ChevronDownOutline } from "@vicons/ionicons5";
import axios from "axios";
import {
  computed,
  defineAsyncComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { useOptionsStore } from "@/stores/options";

import schemaJson from "@/assets/json/schema.json";
import suggestions from "@/assets/json/suggestions.json";
import icons from "@/assets/json/icons.json";
import { useNotification } from "naive-ui";

axios.defaults.headers.get["content-type"] = "application/json";

const JsonView = defineAsyncComponent(
  () => import("@/components/home/JsonView.vue")
);
const CodeSection = defineAsyncComponent(
  () => import("@/components/home/CodeSection.vue")
);
const ApiSection = defineAsyncComponent(
  () => import("@/components/home/APISection.vue")
);

const OptionsSection = defineAsyncComponent(
  () => import("@/components/home/OptionsSection.vue")
);

const optionsStore = useOptionsStore().$state;
const notification = useNotification();

const folder = ref("");
const category = ref("");
const query = ref("");

const suggestionsShown = ref({});

const code = ref("");
const link = ref<string>("");
const isLoading = ref(false);
const queryDisabled = ref(false);

const response = ref({});

onMounted(() => {
  if (!folder.value) folder.value = Object.keys(schemaJson)[0];
  if (!category.value && folder.value)
    category.value = (schemaJson as any)[folder.value][0];
});

const folderOptions = computed({
  get() {
    let options: any = [];
    Object.keys(schemaJson).forEach((element: string) => {
      options.push({ value: element, label: element, disabled: false });
    });
    return options;
  },
  set() {},
});

const categoryOptions = computed({
  get() {
    let options: any = [];
    (schemaJson as any)[folder.value]?.forEach((value: any) => {
      options.push({ value: value, label: value, disabled: false });
    });
    return options;
  },
  set() {},
});

watch(folder, (newFolder) => {
  category.value = (categoryOptions.value as any)[0].value;
});

watch(category, (newCategory) => {
  suggestionsShown.value = (suggestions as any)[category.value];
  query.value = category.value === "all" ? "names" : "";
  queryDisabled.value = category.value === "all" ? true : false;
});

function getData() {
  link.value = generateURL();
  isLoading.value = true;
  response.value = {};
  axios
    .get(link.value)
    .then((resp) => {
      response.value = { ...resp };
    })
    .catch(() => {
      isLoading.value = false;
      notification.create({
        title: "Error",
        content: "Failed to retrieve data.",
        duration: 2500,
        type: "error",
      });
    })
    .finally(() => {
      isLoading.value = false;
      generateURL();
      generateCode();
    });
}

function generateURL() {
  const defaultOptions = getDefaultOptions();
  let codeOptions = Object.entries(optionsStore).filter(
    ([key, value]) =>
      (!Array.isArray(value) && value !== defaultOptions[key]) ||
      (Array.isArray(value) &&
        JSON.stringify(value.sort()) !==
          JSON.stringify(defaultOptions[key].sort()))
  );
  return getUrl(folder.value, query.value, Object.fromEntries(codeOptions));
}

function generateCode() {
  const defaultOptions = getDefaultOptions();
  let codeOptions = Object.entries(optionsStore).filter(
    ([key, value]) =>
      (!Array.isArray(value) && value !== defaultOptions[key]) ||
      (Array.isArray(value) &&
        JSON.stringify(value.sort()) !==
          JSON.stringify(defaultOptions[key].sort()))
  );

  if (Object.keys(codeOptions).length === 0) {
    code.value = `genshinDb.${folder.value}("${
      query.value ? query.value : "names"
    }");`;
  } else {
    code.value = `genshinDb.${folder.value}("${
      query.value ? query.value : "names"
    }", ${JSON.stringify(Object.fromEntries(codeOptions))});`;
  }
}
</script>

<template>
  <n-grid x-gap="12" cols="2 xs:1 s:1 m:2 l:2 xl:2 2xl:2" responsive="screen">
    <n-gi>
      <n-space vertical>
        <n-card title="Query">
          <n-space inline>
            <n-select
              v-model:value="folder"
              filterable
              placeholder="Select a folder"
              :options="folderOptions"
            >
            </n-select>
            <n-select
              v-model:value="category"
              filterable
              :consistent-menu-width="true"
              placeholder="Select a
            category"
              :options="categoryOptions"
            />
            <n-input
              v-model:value="query"
              placeholder="Enter query"
              :disabled="queryDisabled"
              @keyup.enter="getData()"
            />
            <n-button @click="getData()" type="primary">
              <template #icon>
                <n-icon>
                  <ChevronDownOutline />
                </n-icon>
              </template>
              Get
            </n-button>
          </n-space>
          <n-space vertical v-if="suggestionsShown">
            <h4 style="margin-block-end: 0.1em">Suggestions</h4>
            <n-space inline>
              <n-tag
                checkable
                round
                bordered
                :checked="query == suggestion"
                v-for="suggestion in suggestionsShown"
                @click="query = suggestion"
              >
                {{ suggestion }}
                <template #icon v-if="icons[suggestion]">
                  <n-avatar :src="icons[suggestion]" />
                </template>
              </n-tag>
            </n-space>
          </n-space>
          <OptionsSection />
        </n-card>
        <CodeSection :code="code" />
        <ApiSection :link="link" />
      </n-space>
    </n-gi>
    <n-gi>
      <JsonView :response="response" :isLoading="isLoading" />
    </n-gi>
  </n-grid>
</template>

<style>
/* TODO: flex-wrap:none on 1366 */
</style>
