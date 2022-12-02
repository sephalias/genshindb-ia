<template>
  <div id="options">
    <OptionsSkeleton v-if="isLoading" />
    <div id="optionsDefault" class="card m-1" v-else>
      <p class="title u-text-center mb-0">Options</p>
      <div class="u-block">
        <div
          class="form-ext-control form-ext-checkbox u-inline-block"
          v-for="(value, index) in options"
          :key="index"
        >
          <input
            :id="'check' + index"
            class="form-ext-input"
            type="checkbox"
            v-model="options[index]"
            v-if="typeof options[index] == 'boolean'"
          />
          <label
            class="form-ext-label"
            :for="'check' + index"
            v-if="typeof options[index] == 'boolean'"
            @mouseover="optionHover = index"
            @mouseleave="optionHover = null"
          >
            {{ index }}
          </label>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <label
            class="m-0"
            for="selectResultLanguage"
            @mouseover="optionHover = 'resultLanguage'"
            @mouseleave="optionHover = null"
          >
            Result Language:
          </label>
          <select
            id="selectResultLanguage"
            class="select input-small"
            placeholder="Choose one"
            v-model="options.resultLanguage"
          >
            <option
              v-for="language in languages"
              :key="language"
              :value="language"
            >
              {{ language }}
            </option>
          </select>
        </div>
        <div class="col-6">
          <label
            class="m-0"
            for="selectQueryLanguages"
            @mouseover="optionHover = 'queryLanguages'"
            @mouseleave="optionHover = null"
          >
            Query Languages:
          </label>
          <select
            id="selectQueryLanguages"
            class="select input-small"
            placeholder="Choose one"
            @change="addQueryLanguage($event)"
          >
            <option :value="null">-- Select --</option>
            <option
              v-for="language in languages"
              :key="language"
              :value="language"
            >
              {{ language }}
            </option>
          </select>
          <div class="tag-container u-center mt-2">
            <div
              class="tag tag--primary"
              v-for="language in options.queryLanguages"
              :key="language"
            >
              {{ language }}
              <div
                class="tag tag__delete mt-1"
                @click="removeQueryLanguage(language)"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <blockquote class="mx-1 mt-1 animated fadeIn" v-if="optionHover">
        <span
          ><strong>{{ optionHover }}:</strong>
          {{ optionsDesc[optionHover] }}
        </span>
      </blockquote>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import axios from "axios";

import getUrl from "@/assets/js/api.js";

export default {
  components: {
    OptionsSkeleton: defineAsyncComponent(() =>
      import("@/components/home/OptionsSkeleton.vue")
    ),
  },
  data() {
    return {
      isLoading: Boolean,
      options: {
        dumpResult: false,
        matchAltNames: false,
        matchAliases: false,
        matchCategories: true,
        verboseCategories: false,
        resultLanguage: "English",
        queryLanguages: ["English"],
      },
      languages: null,
      optionHover: null,
    };
  },
  mounted() {
    this.getLanguages();
  },
  watch: {
    options: {
      deep: true,
      immediate: true,
      handler() {
        this.$emit("options", this.options);
      },
    },
  },
  methods: {
    getLanguages() {
      this.isLoading = true;
      axios
        .get(getUrl("languages"))
        .then((response) => (this.languages = response.data))
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    addQueryLanguage(event) {
      let language = event.target.value;
      if (!(language == "-- Select --")) {
        if (!this.options.queryLanguages.includes(language)) {
          this.options.queryLanguages.push(language);
        }
      }
    },
    removeQueryLanguage(language) {
      if (this.options.queryLanguages.includes(language)) {
        this.options.queryLanguages = this.options.queryLanguages.filter(l => l !== language);
      }
    },
  },
  computed: {
    optionsDesc() {
      return {
        dumpResult:
          "The query result will return an object with the properties: query, folder, match, options, filename, result.",
        matchAltNames: "Allows the matching of alternate or custom names.",
        matchAliases:
          "Allows the matching of aliases. These are searchable fields that returns the data object the query matched in.",
        matchCategories:
          "Allows the matching of categories. If true, then returns an array if it matches.",
        verboseCategories:
          "Used if a category is matched. If true, then replaces each string name in the array with the data object instead.",
        queryLanguages:
          "Array of languages that your query will be searched in.",
        resultLanguage: "Output language that you want your results to be in.",
      };
    },
  },
};
</script>

<style></style>
