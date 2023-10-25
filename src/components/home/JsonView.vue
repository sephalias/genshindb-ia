<script setup lang="ts">
import { getImageUrl } from "@/scripts/utils";
import { useOptionsStore } from "@/stores/options";
import { useSettingsStore } from "@/stores/settings";
import { ImageOutline, OpenOutline } from "@vicons/ionicons5";
import { computed, defineAsyncComponent, onMounted, ref, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const JsonViewSkeleton = defineAsyncComponent(
  () => import("@/components/home/JsonViewSkeleton.vue")
);

const optionsStore = useOptionsStore().$state;
const settingsStore = useSettingsStore();

const showResults = ref(true);

const isImageLoading = ref(false);
const imageUrl = ref("");
const showImagePreviewModal = ref(false);

const vjsTreeNodeBackgroundColor = ref("");

interface IJsonView {
  response: any;
  isLoading: Boolean;
}

const props = defineProps<IJsonView>();

// TODO: Optimize
// TODO: Hide show result if dumpResult is false
const filteredData = computed({
  get() {
    let filtered_data = {};
    if (optionsStore.dumpResult) {
      if (showResults.value) filtered_data = props.response.data.result;
      else filtered_data = props.response.data;
    } else filtered_data = props.response.data;
    return filtered_data;
  },
  set() {},
});

/*
 * Fix for VuePrettyJson hover color on darkmode. On Mounted
 */
onMounted(() => {
  settingsStore.theme === "dark"
    ? (vjsTreeNodeBackgroundColor.value = "#e6f7ff29")
    : (vjsTreeNodeBackgroundColor.value = "#e6f7ff");
});

/*
 * Fix for VuePrettyJson hover color on darkmode. Listens to theme changes.
 */
watch(
  () => settingsStore.theme,
  (n) => {
    n === "dark"
      ? (vjsTreeNodeBackgroundColor.value = "#e6f7ff29")
      : (vjsTreeNodeBackgroundColor.value = "#e6f7ff");
  }
);

watch(
  () => settingsStore.themeAuto,
  (n) => {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      vjsTreeNodeBackgroundColor.value = "#e6f7ff29";
    } else {
      vjsTreeNodeBackgroundColor.value = "#e6f7ff";
    }
  }
);

function previewImage(url: string) {
  showImagePreviewModal.value = true;
  isImageLoading.value = true;
  imageUrl.value = url;
}

function onImageLoad() {
  isImageLoading.value = false;
}

function onModalClose() {
  isImageLoading.value = false;
  imageUrl.value = "";
}
</script>

<template>
  <n-card title="Response">
    <template #header-extra v-if="!isLoading">
      <n-space v-if="optionsStore.dumpResult">
        Show Result
        <n-switch v-model:value="showResults" />
      </n-space>
    </template>
    <JsonViewSkeleton v-if="isLoading" />
    <div id="jsonView" v-else>
      <n-empty
        description="Nothing to show."
        v-if="props.response?.status !== 200 || filteredData === ''"
      >
      </n-empty>
      <VueJsonPretty
        v-else
        :on-brackets-click="
          (collapsed = true) => console.log('updated', collapsed)
        "
        :data="filteredData"
        :deep="2"
        :showLength="true"
      >
        <template #renderNodeKey="{ node, defaultKey }">
          <template
            v-if="
              typeof node.content === 'string' &&
              (node.content.startsWith('http://') ||
                node.content.startsWith('https://')) &&
              (node.content.endsWith('.png') || node.content.endsWith('.jpg'))
            "
          >
            <span style="text-wrap: nowrap">
              <n-icon :component="ImageOutline"></n-icon>&nbsp;{{ node.key }}
            </span>
          </template>
          <template v-else>
            <span>{{ defaultKey }} </span>
          </template>
        </template>
        <template #renderNodeValue="{ node, defaultValue }">
          <template
            v-if="
              typeof node.content === 'string' &&
              (node.content.startsWith('http://') ||
                node.content.startsWith('https://')) &&
              (node.content.endsWith('.png') || node.content.endsWith('.jpg'))
            "
          >
            <a
              @click="previewImage(node.content)"
              style="cursor: pointer"
              title="Click to preview image."
            >
              <span>&nbsp;{{ node.content }}</span>
            </a>
          </template>
          <template v-else>
            <span>&nbsp;{{ defaultValue }} </span>
          </template>
        </template>
      </VueJsonPretty>
    </div>
    <template
      #footer
      v-if="!(props.response?.status !== 200 || filteredData === '')"
    >
      Status: {{ response?.status }} {{ response?.statusText }} &nbsp; Date:
      {{ response?.headers?.date }}
    </template>
  </n-card>

  <n-modal
    v-model:show="showImagePreviewModal"
    class="custom-card"
    preset="card"
    :style="{ width: '600px' }"
    :title="imageUrl.split('/')[imageUrl.split('/').length - 1]"
    :bordered="true"
    :on-after-leave="onModalClose"
  >
    <template #header-extra> </template>
    <n-space justify="center" align="center">
      <n-image
        style="max-width: 300"
        width="200"
        :src="imageUrl"
        :fallback-src="getImageUrl('img/no-image.png')"
        onload="onImageLoad"
        :on-load="onImageLoad"
        show-toolbar-tooltip
        v-show="!isImageLoading"
      />
      <n-spin size="large" v-show="isImageLoading" />
    </n-space>

    <template #footer>
      <n-space>
        <n-a :href="imageUrl">
          {{ imageUrl.split("/")[imageUrl.split("/").length - 1] }}
          &nbsp;
          <n-icon :component="OpenOutline"></n-icon>
        </n-a>
      </n-space>
    </template>
  </n-modal>
</template>

<style>
/* Fix for VuePrettyJson colon is breaking down. */
.vjs-key {
  text-wrap: nowrap;
}

/* Fix for VuePrettyJson hover color on darkmode.  */
.vjs-tree-node:hover {
  background-color: v-bind("vjsTreeNodeBackgroundColor");
}
</style>
