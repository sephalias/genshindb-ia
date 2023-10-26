<script setup lang="ts">
import { ColorPaletteOutline, Moon, Sunny } from "@vicons/ionicons5";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import type { MenuOption } from "naive-ui";
import { NSwitch, darkTheme } from "naive-ui";
import { computed, h, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { useSettingsStore } from "./stores/settings";

import themes from "@/assets/json/theme.json";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);

const settings = useSettingsStore();

const activeKey = ref();
const router = useRoute();

const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "home",
          },
        },
        { default: () => "Home" }
      ),
    key: "home",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "settings",
          },
        },
        { default: () => "Settings" }
      ),
    key: "settings",
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "about",
          },
        },
        { default: () => "About" }
      ),
    key: "about",
  },
];

onMounted(() => {
  let appThemeMode = localStorage.getItem("appThemeMode");
  let appThemeModeAuto = localStorage.getItem("isAppThemeModeAuto");
  let themeColor = localStorage.getItem("appThemeColor");

  if (!appThemeMode || !appThemeModeAuto || !themeColor) {
    settings.setColor("green");
    settings.applySystemTheme();
  } else {
    settings.theme = appThemeMode;
    settings.themeAuto = appThemeModeAuto === "true" ? true : false;
    settings.setColor(themeColor);
  }

  setTimeout(() => {
    if (router.name === "query") activeKey.value = "home";
    else activeKey.value = router.name;
  }, 2000);
});

const isDark = computed({
  get() {
    return settings.theme === "dark" ? true : false;
  },
  set(newValue) {
    console.log("newvalue", newValue);
    settings.theme === "dark"
      ? settings.applyLightTheme()
      : settings.applyDarkTheme();
  },
});

const theme = computed(() => {
  if (settings.themeAuto) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return darkTheme;
    } else {
      return null;
    }
  } else {
    return settings.theme == "dark" ? darkTheme : null;
  }
});

const themeOverrides = computed(() => {
  return {
    common: {
      ...(themes as any)[settings.themeColor],
    },
  };
});

function toggleTheme() {
  if (settings.theme === "dark") isDark.value = false;
  if (settings.theme === "light") isDark.value = true;
}

// FIXME: Mobile Navigation
function toggleNav(event: {
  target: { classList: { toggle: (arg0: string) => void } };
}) {
  event.target.classList.toggle("active");
  document.querySelector(".header-nav")?.classList.toggle("active");
}
</script>

<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="themeOverrides"
    :hljs="hljs"
  >
    <n-notification-provider placement="bottom">
      <n-message-provider>
        <n-dialog-provider>
          <n-layout id="main">
            <n-layout-header
              style="
                height: 64px;
                --side-padding: 32px;
                grid-template-columns: calc(272px - var(--side-padding)) 1fr auto;
              "
              bordered
              position="static"
              class="nav"
            >
              <div class="n-text ui-logo">
                <router-link
                  :to="{ name: 'home' }"
                  style="color: inherit; text-decoration: none"
                  @click="activeKey = 'home'"
                >
                  <b>GenshinDB</b>
                  <span style="font-weight: lighter"> Interactive</span>
                </router-link>
              </div>

              <div style="display: flex; align-items: center">
                <n-menu
                  v-model:value="activeKey"
                  mode="horizontal"
                  :options="menuOptions"
                />
              </div>

              <div class="nav-end">
                <n-space style="align-items: center">
                  <n-button
                    @click="
                      settings.themeAuto
                        ? settings.applyFixedTheme()
                        : settings.applySystemTheme()
                    "
                    round
                  >
                    <template #icon>
                      <n-icon>
                        <color-palette-outline />
                      </n-icon>
                    </template>
                    {{ settings.themeAuto ? "Auto" : "Fixed" }}
                  </n-button>
                  <n-switch
                    v-model:value="isDark"
                    size="large"
                    @update="toggleTheme"
                    v-if="!settings.themeAuto"
                  >
                    <template #checked-icon>
                      <n-icon :component="Moon" />
                    </template>
                    <template #unchecked-icon>
                      <n-icon :component="Sunny" />
                    </template>
                  </n-switch>
                </n-space>
              </div>
            </n-layout-header>
            <n-layout-content content-style="padding: 32px;" id="main-content">
              <router-view />
            </n-layout-content>
            <n-layout-footer
              bordered
              id="footer"
              style="
                margin-top: auto;
                height: 50px;
                padding-left: 30px;
                padding-right: 30px;
                padding-top: 15px;
                padding-bottom: 15px;
              "
            >
              <n-space justify="space-around">
                &copy; 2021-{{ new Date().getFullYear() }} Sephalias
              </n-space>
            </n-layout-footer>
          </n-layout>
        </n-dialog-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style>
.nav {
  align-items: center;
  display: grid;
  grid-template-rows: calc(var(--header-height) - 1px);
  padding: 0 var(--side-padding);
}

.nav-end {
  align-items: center;
  display: flex;
}
.ui-logo {
  cursor: pointer;
  display: flex;
  font-size: 18px;
}

body {
  min-height: 100vh;
}

#app .n-config-provider #main {
  min-height: 100vh;
}

#main-content {
  min-height: calc(100vh - 115px);
}
</style>
