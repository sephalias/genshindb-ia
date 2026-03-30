import { getDefaultOptions } from "@/scripts/api";
import { defineStore } from "pinia";

interface OptionsState {
  dumpResult: boolean;
  matchNames: boolean;
  matchAltNames: boolean;
  matchAliases: boolean;
  matchCategories: boolean;
  verboseCategories: boolean;
  queryLanguages: string[];
  resultLanguage: string;
}

export const useOptionsStore = defineStore("options", {
  state: (): OptionsState => ({
    ...getDefaultOptions(),
  }),
  getters: {},
  actions: {
    initializeOptions() {
      Object.assign(this, getDefaultOptions());
    },
  },
});
