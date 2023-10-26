import { getDefaultOptions } from "@/scripts/api";
import { defineStore } from "pinia";

export const useOptionsStore = defineStore({
  id: "options",
  state: () => ({
    ...getDefaultOptions(),
  }),
  getters: {},
  actions: {
    initializeOptions() {
      this.state = { ...getDefaultOptions() };
    },
  },
});
