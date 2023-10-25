import { defineStore } from "pinia";

export const useSettingsStore = defineStore({
  id: "settings",
  state: () => ({
    theme: "",
    themeAuto: false,
    themeColor: "green",
  }),
  getters: {},
  actions: {
    applyDarkTheme() {
      localStorage.setItem("appThemeMode", "dark");
      localStorage.setItem("isAppThemeModeAuto", "false");
      this.theme = "dark";
      this.themeAuto = false;
    },
    applyLightTheme() {
      localStorage.setItem("appThemeMode", "light");
      localStorage.setItem("isAppThemeModeAuto", "false");
      this.theme = "light";
      this.themeAuto = false;
    },
    applyFixedTheme() {
      let themeMode = localStorage.getItem("appThemeMode");
      localStorage.setItem("isAppThemeModeAuto", "false");
      this.theme = themeMode ? themeMode : "";
      this.themeAuto = false;
    },
    applySystemTheme() {
      let themeMode = localStorage.getItem("appThemeMode");
      localStorage.setItem("isAppThemeModeAuto", "true");
      this.theme = themeMode ? themeMode : "";
      this.themeAuto = true;
    },
    setColor(color: string) {
      localStorage.setItem("appThemeColor", color);
      this.themeColor = color;
    },
  },
});
