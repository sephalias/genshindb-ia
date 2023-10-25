<script setup lang="ts">
import themes from "@/assets/json/theme.json";
import { useSettingsStore } from "@/stores/settings";
import { ColorPalette, Warning } from "@vicons/ionicons5";
import { useNotification } from "naive-ui";
import { onMounted, ref, watch } from "vue";

const settings = useSettingsStore();
const notification = useNotification();

const APIEndpoint = ref();

// @ts-ignore
const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

const optionModel = ref();
const optionsSelect = [
  {
    value: "light",
    label: "Light",
  },
  {
    value: "dark",
    label: "Dark",
  },
  {
    value: "auto",
    label: "Auto",
  },
];

onMounted(() => {
  if (settings.themeAuto) {
    optionModel.value = "auto";
  } else {
    settings.theme === "dark"
      ? (optionModel.value = "dark")
      : (optionModel.value = "light");
  }
});

watch(optionModel, (newThemeMode) => {
  if (newThemeMode === "dark") {
    settings.applyDarkTheme();
  } else if (newThemeMode === "light") {
    settings.applyLightTheme();
  } else if (newThemeMode === "auto") settings.applySystemTheme();
});

function switchColor(color: string) {
  settings.setColor(color);
  notification.create({
    title: "Success",
    content: `Theme color set to ${color}.`,
    duration: 2500,
    type: "success",
  });
}
</script>

<template>
  <n-space vertical>
    <n-card title="Appearance">
      <n-list>
        <n-list-item>
          <n-thing title="Theme" content-style="margin-top: 10px;">
            <template #description>
              <p>App Theme</p>
            </template>
            <template #header-extra> {{ optionModel }}</template>
            <n-select
              v-model:value="optionModel"
              :options="optionsSelect"
              style="max-width: 25%"
            />
          </n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing title="Color Scheme" content-style="margin-top: 10px;">
            <template #description>
              <p>Color theme</p>
            </template>
            <n-grid
              x-gap="10"
              y-gap="10"
              cols="1 400:1 500:2 600:2 800:3 1000:4 1300:5 1600:6"
            >
              <n-grid-item v-for="(theme, key) in themes">
                <n-button
                  :style="{
                    '--n-ripple-color': theme.primaryColorSuppl,
                    '--n-border-hover': '1px solid ' + theme.primaryColorHover,
                    '--n-border-focus': '1px solid ' + theme.primaryColor,
                    '--n-border-pressed':
                      '1px solid ' + theme.primaryColorSuppl,
                    '--n-text-color-hover': theme.primaryColorHover,
                    '--n-text-color-pressed': theme.primaryColorPressed,
                    '--n-text-color-focus': theme.primaryColorHover,
                  }"
                  style="width: 100%; justify-content: start"
                  @click="switchColor(key)"
                  :disabled="key === settings.themeColor"
                >
                  <template #icon>
                    <n-icon :color="theme.primaryColor">
                      <ColorPalette />
                    </n-icon>
                  </template>
                  <n-space
                    style="align-items: center; width: 100%"
                    justify="space-between"
                  >
                    <span style="margin-right: 10px">{{ key }}</span>
                    <n-space size="small">
                      <n-tag
                        v-for="color in theme"
                        :style="{
                          'background-color': color,
                          width: '20px',
                        }"
                      >
                      </n-tag>
                    </n-space>
                  </n-space>
                </n-button>
              </n-grid-item>
            </n-grid>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card>
    <n-card title="API" size="medium">
      <n-list>
        <n-list-item>
          <n-thing>
            <template #header>
              <n-space style="align-items: center">
                API Endpoint
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-icon :component="Warning" />
                  </template>
                  WIP
                </n-tooltip>
              </n-space>
            </template>
            <n-input
              v-model:value="APIEndpoint"
              disabled
              :placeholder="baseUrl"
              autosize
              style="min-width: 25%"
            />
          </n-thing>
        </n-list-item>
        <n-list-item>
          <n-thing>
            <template #header>
              <n-space style="align-items: center">
                Image URL
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-icon :component="Warning" />
                  </template>
                  WIP
                </n-tooltip>
              </n-space>
            </template>
            <n-input
              v-model:value="APIEndpoint"
              disabled
              :placeholder="baseUrl"
              autosize
              style="min-width: 25%"
            />
          </n-thing>
        </n-list-item>
      </n-list>
    </n-card>
  </n-space>
</template>

<style>
.n-button__content {
  width: 100%;
}
</style>
