<template>
  <div id="home">
    <div class="row">
      <div class="col-md-6 col-sm-12">
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
              <Search />
            </button>
          </div>
          <div class="u-flex m-1" v-if="suggestion">
            <label class="mr-1"> Suggestions: </label>
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
        <Options @options="getOptions" />
        <Code :code="code" />
        <API :link="link" />
      </div>
      <div class="col-md-6 col-sm-12" id="data">
        <JsonView :data="data" :isLoading="dataLoad" />
      </div>
    </div>
  </div>
</template>

<script>
import { getUrl } from "@/assets/js/api.js";
import axios from "axios";
import { defineAsyncComponent } from "vue";
import { Search } from "lucide-vue-next";
axios.defaults.headers.get["content-type"] = "application/json";

import schema from "@/assets/js/schema.json";
import suggestions from "@/assets/js/suggestions.json";

export default {
  components: {
    JsonView: defineAsyncComponent(() =>
      import("@/components/home/JsonView.vue")
    ),
    Code: defineAsyncComponent(() =>
      import("@/components/home/CodeSection.vue")
    ),
    API: defineAsyncComponent(() => import("@/components/home/APISection.vue")),
    Options: defineAsyncComponent(() =>
      import("@/components/home/OptionsSection.vue")
    ),
    Search,
  },
  data() {
    return {
      data: null,
      query: "",
      options: null,
      folder: null,
      category: null,
      suggestion: null,
      code: null,
      link: null,
      dataLoad: false,
      queryDisabled: false,
    };
  },
  computed: {
    schema() {
      return schema;
    },
    suggestions() {
      return suggestions;
    },
  },
  mounted() {
    if (!this.folder) this.folder = Object.keys(this.schema)[0];
    if (!this.category && this.folder)
      this.category = this.schema[this.folder][0];
    if (!this.suggestion && this.category) {
      this.suggestion = this.suggestions[this.category];
    }
    this.updateControls();
  },
  methods: {
    getData() {
      this.dataLoad = true;
      let url = getUrl(this.folder, this.query, this.options);
      axios
        .get(url)
        .then((response) => (this.data = response.data))
        .catch(() => {
          this.dataLoad = false;
        })
        .finally(() => {
          this.dataLoad = false;
          this.generateURL();
          this.generateCode();
        });
    },
    generateURL() {
      let options = Object.entries(this.options).filter(
        ([key, value]) =>
          key &&
          value &&
          !(
            (key == "resultLanguage" && value == "English") ||
            (key == "queryLanguages" && value == "English")
          )
      );
      let url = getUrl(this.folder, this.query);
      options.forEach((option) => {
        url += `&${option[0]}=${option[1]}`;
      });
      this.link = url;
    },
    generateCode() {
      let options = Object.entries(this.options).filter(
        ([key, value]) =>
          key &&
          value &&
          !(
            (key == "resultLanguage" && value == "English") ||
            (key == "queryLanguages" && value == "English")
          )
      );
      this.code = `genshinDb.${this.folder}("${this.query}", ${JSON.stringify(
        Object.fromEntries(options)
      )}");`;
    },
    updateControls() {
      this.suggestion = this.suggestions[this.category];
      if (this.options) {
        this.options.matchCategories = true;
      }
      if (this.suggestion) this.query = this.suggestion[0];
      else this.query = "";

      if (this.category == "all") {
        this.queryDisabled = true;
        this.suggestion = null;
      } else if (this.category == "query") {
        if (this.options) {
          this.options.matchCategories = false;
        }
        this.queryDisabled = false;
      } else {
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
    setSuggestionToQuery(suggestion) {
      this.query = suggestion;
    },
    getOptions(options) {
      this.options = options;
    },
  },
};
</script>

<style></style>
