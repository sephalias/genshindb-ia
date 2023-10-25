import { getDefaultOptions } from "@/scripts/api";
import { defineStore } from "pinia";

export const useOptionsStore = defineStore({
  id: "options",
  state: () => ({
    ...getDefaultOptions(),
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {},
});
