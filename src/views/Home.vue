<template>
  <div id="home">
    <div class="row">
      <div class="col-6 col-sm-12">
        <div class="card m-1" id="query">
          <div class="form-group m-0">
            <select
              class="form-group-input input-small"
              placeholder="Choose one"
              v-model="folder"
              @change="onFolderChange($event)"
            >
              <option
                :value="index"
                v-for="(folder, index) in schema"
                :key="index"
              >
                {{ index }}
              </option>
            </select>
            <select
              class="form-group-input input-small"
              placeholder="Choose one"
              v-model="category"
              @change="onCategoryChange($event)"
            >
              <option
                :value="category"
                v-for="category in schema[folder]"
                :key="category"
              >
                {{ category }}
              </option>
            </select>
            <input
              class="form-group-input input-small w-100"
              v-model="query"
              :disabled="queryDisabled"
              @keyup.enter="getData()"
            />
            <button
              class="form-group-btn btn-primary btn-small"
              @click="getData()"
            >
              Go
            </button>
          </div>
          <div class="u-flex m-1" v-if="suggestion">
            <label class="mr-1">
              Suggestions:
            </label>
            <div class="tag-container">
              <div
                class="tag tag--primary"
                v-for="item in suggestion"
                :key="item"
                @click="setSuggestionToQuery(item)"
              >
                {{ item }}
              </div>
            </div>
          </div>
        </div>
        <div id="options" class="card m-1">
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
                  >{{ language }}</option
                >
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
                  >{{ language }}</option
                >
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
              {{ optionsUI[optionHover] }}
            </span>
          </blockquote>
        </div>
      </div>
      <div class="col-6 col-sm-12" id="data">
        <Code :code="code" />
        <JsonView :data="data" :isLoading="dataLoad" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import * as api from "@/assets/js/api.js";
import * as axios from "axios";
axios.defaults.headers.get["folder-type"] = "application/json";

export default {
  components: {
    JsonView: defineAsyncComponent(() => import("@/components/home/JsonView")),
    Code: defineAsyncComponent(() => import("@/components/home/Code")),
  },
  data() {
    return {
      data: null,
      query: "",
      options: {
        dumpResult: false,
        matchAltNames: false,
        matchAliases: false,
        matchCategories: false,
        verboseCategories: false,
        resultLanguage: "English",
        queryLanguages: ["English"],
      },
      folder: null,
      category: null,
      suggestion: null,

      code: null,

      dataLoad: false,
      queryDisabled: false,
      optionHover: null,
      languages: null,
    };
  },
  computed: {
    schema() {
      return require("@/assets/js/schema.js").default;
    },
    suggestions() {
      return require("@/assets/js/suggestions.js").default;
    },
    optionsUI() {
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
  mounted() {
    this.getLanguages();
    if (!this.folder) this.folder = Object.keys(this.schema)[0];
    if (!this.category && this.folder)
      this.category = this.schema[this.folder][0];
    if (!this.suggestion && this.category) {
      this.suggestion = this.suggestions[this.category];
    }
    this.updateControls();
  },
  methods: {
    getLanguages() {
      this.dataLoad = true;
      let url = api.getUrl("languages");
      axios
        .get(url)
        .then((response) => (this.languages = response.data))
        .catch((error) => {
          console.log(error);
          this.dataLoad = false;
        })
        .finally(() => {
          this.dataLoad = false;
        });
    },
    getData() {
      this.dataLoad = true;
      let url = api.getUrl(this.folder, this.query, this.options);
      axios
        .get(url)
        .then((response) => (this.data = response.data))
        .catch((error) => {
          console.log(error);
          this.dataLoad = false;
        })
        .finally(() => {
          this.dataLoad = false;
          this.generateCode();
        });
    },
    generateCode() {
      let options = Object.entries(this.options).filter(
        ([key, value]) => key && value
      );
      this.code = `genshinDb.${this.folder}("${this.query}", ${JSON.stringify(
        Object.fromEntries(options)
      )}");`;
    },
    updateControls() {
      this.suggestion = this.suggestions[this.category];
      if (this.suggestion) this.query = this.suggestion[0];
      else this.query = "";
      if (this.category == "all") {
        this.queryDisabled = true;
        this.options.matchCategories = true;
        this.suggestion = null;
      } else if (this.category == "query") {
        this.options.matchCategories = false;
        this.queryDisabled = false;
      } else {
        this.options.matchCategories = true;
        this.queryDisabled = false;
      }
    },
    onFolderChange(event) {
      this.category = this.schema[event.target.value][0];
      this.updateControls();
    },
    onCategoryChange(event) {
      this.suggestion = this.suggestions[event.target.value];
      this.updateControls();
    },
    setOptionInfo(text) {
      if (text) {
        this.optionHover = text;
      } else {
        this.optionHover = "";
      }
      console.log(text);
    },
    setSuggestionToQuery(suggestion) {
      this.query = suggestion;
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
        this.options.queryLanguages.pop(language);
      }
    },
  },
};
</script>

<style>
.tooltip {
  white-space: pre-line;
}
</style>
