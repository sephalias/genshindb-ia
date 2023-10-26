<script setup lang="ts">
import icons from "@/assets/json/icons.json";
import schemaJson from "@/assets/json/schema.json";
import suggestions from "@/assets/json/suggestions.json";
import router from "@/router";
import { getDefaultOptions, getUrl } from "@/scripts/api";
import { getImageUrl } from "@/scripts/utils";
import { useOptionsStore } from "@/stores/options";
import { ChevronDownOutline } from "@vicons/ionicons5";
import axios from "axios";
import { useDialog, useNotification } from "naive-ui";
import { computed, defineAsyncComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

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

const ShareSection = defineAsyncComponent(
  () => import("@/components/home/ShareSection.vue")
);

const optionsStore = useOptionsStore();
const notification = useNotification();
const dialog = useDialog();
const route = useRoute();

const folder = ref("");
const category = ref("");
const query = ref("");

const suggestionsShown = ref();

const code = ref("");
const APILink = ref<string>("");
const shareLink = ref<string>("");
const fromLinkReady = ref(false);

const isLoading = ref(false);
const queryDisabled = ref(false);

const response = ref({});

onMounted(() => {
  if (!folder.value) folder.value = Object.keys(schemaJson)[0];
  if (!category.value && folder.value)
    category.value = (schemaJson as any)[folder.value][0];
  if (category.value === "all") query.value = "names";
  if (route.name === "query") {
    let routeQuery = route.query;
    if (!routeQuery["folder"]) showQueryError("No Folder");
    else if (!routeQuery["category"]) showQueryError("No Category");
    else if (!routeQuery["query"]) showQueryError("No Query");
    else {
      folder.value = `${routeQuery["folder"]?.toString()}`;
      category.value = `${routeQuery["category"]?.toString()}`;
      query.value = `${routeQuery["query"]?.toString()}`;

      let options = routeQuery["options"]?.toString();
      options?.split(";").forEach((option) => {
        let optionItem = option.split("=");

        let key = optionItem[0];
        let value = null;

        if (optionItem[1] === "true" || optionItem[1] === "false") {
          value = optionItem[1] === "true" ? true : false;
        } else if (key === "resultLanguage") {
          value = optionItem[1];
        } else {
          try {
            value = optionItem[1].split(",");
          } catch {
            showQueryError("Invalid Options");
            return;
          }
        }
        optionsStore.initializeOptions();
        optionsStore.$state[key] = value;
      });

      setTimeout(() => {
        getData();
        fromLinkReady.value = true;
      }, 2000);
    }
  }
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

function onFolderUpdate() {
  category.value = (categoryOptions.value as any)[0].value;
}

function onCategoryUpdate() {
  suggestionsShown.value = (suggestions as any)[category.value];
  query.value = category.value === "all" ? "names" : "";
  queryDisabled.value = category.value === "all" ? true : false;
}

function getData() {
  APILink.value = generateURL();
  isLoading.value = true;
  response.value = {};
  axios
    .get(APILink.value)
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
      generateCode();
      generateShareURL();
    });
}

function generateURL() {
  const defaultOptions = getDefaultOptions();
  let codeOptions = Object.entries(optionsStore.$state).filter(
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
  let codeOptions = Object.entries(optionsStore.$state).filter(
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

function generateShareURL() {
  const defaultOptions = getDefaultOptions();
  let codeOptions = Object.entries(optionsStore.$state).filter(
    ([key, value]) =>
      (!Array.isArray(value) && value !== defaultOptions[key]) ||
      (Array.isArray(value) &&
        JSON.stringify(value.sort()) !==
          JSON.stringify(defaultOptions[key].sort()))
  );

  let link = "";
  const options: any = JSON.parse(
    JSON.stringify(Object.fromEntries(codeOptions))
  );
  for (let option in options) {
    link += `${option}=${options[option]};`;
  }
  let optionsLink = link.toString().substring(0, link.length - 1);

  let url = ` ${window.location.origin}/query?folder=${folder.value}&category=${category.value}&query=${query.value}`;
  if (Object.keys(codeOptions).length > 0) url += `&options=${optionsLink}`;
  shareLink.value = url;
}

function showQueryError(message: string) {
  dialog.error({
    title: "Query Link Invalid",
    content: message,
    positiveText: "Close",
    onPositiveClick: () => {
      router.push({ name: "home" });
      code.value = "";
      APILink.value = "";
      shareLink.value = "";
    },
  });
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
              @update:value="onFolderUpdate"
            >
            </n-select>
            <n-select
              v-model:value="category"
              filterable
              :consistent-menu-width="true"
              placeholder="Select a
            category"
              :options="categoryOptions"
              @update:value="onCategoryUpdate"
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
                <template #icon v-if="(icons as any)[suggestion]">
                  <n-avatar :src="getImageUrl((icons as any)[suggestion])" />
                </template>
              </n-tag>
            </n-space>
          </n-space>
          <OptionsSection />
        </n-card>
        <CodeSection :code="code" />
        <ApiSection :link="APILink" />
        <ShareSection :link="shareLink" />
      </n-space>
    </n-gi>
    <n-gi>
      <JsonView :response="response" :isLoading="isLoading" />
    </n-gi>
  </n-grid>
</template>

<style></style>
