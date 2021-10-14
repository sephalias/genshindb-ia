<template>
  <div id="home">
    <div class="row">
      <div class="col-6 col-sm-12">
        <div class="card m-1" id="query">
          <div class="form-group m-0">
            <select
              class="form-group-input input-small"
              placeholder="Choose one"
              v-model="content"
            >
              <option
                :value="index"
                v-for="(content, index) in schema"
                :key="index"
              >
                {{ index }}
              </option>
            </select>
            <select
              class="form-group-input input-small"
              placeholder="Choose one"
              v-model="subContent"
            >
              <option
                :value="subContent"
                v-for="subContent in schema[content]"
                :key="subContent"
              >
                {{ subContent }}
              </option>
            </select>
            <input
              class="form-group-input input-small w-100"
              v-model="query"
              @keyup.enter="getData()"
            />
            <button
              class="form-group-btn btn-primary btn-small"
              @click="getData()"
            >
              Go
            </button>
          </div>
        </div>
        <div id="options" class="card m-1">
          <p class="title u-text-center mb-0">Options</p>
          <div class="u-block">
            <div
              class="form-ext-control form-ext-checkbox tooltip u-inline-block"
              data-tooltip="Allows the matching of alternate or custom names."
            >
              <input
                id="checkAltNames"
                class="form-ext-input"
                type="checkbox"
                v-model="options.matchAltNames"
              />
              <label class="form-ext-label" for="checkAltNames"
                >Match Alt Names</label
              >
            </div>
            <div
              class="form-ext-control form-ext-checkbox tooltip u-inline-block"
              data-tooltip="Allows the matching of aliases. These are searchable fields that returns the data object the query matched in."
            >
              <input
                id="checkMatchAliases"
                class="form-ext-input"
                type="checkbox"
                v-model="options.matchAliases"
              />
              <label class="form-ext-label" for="checkMatchAliases"
                >Match Aliases</label
              >
            </div>
            <div
              class="form-ext-control form-ext-checkbox tooltip u-inline-block"
              data-tooltip="Allows the matching of categories. If true, then returns an array if it matches."
            >
              <input
                id="checkMatchCategories"
                class="form-ext-input"
                type="checkbox"
                v-model="options.matchCategories"
              />
              <label class="form-ext-label" for="checkMatchCategories"
                >Match Categories</label
              >
            </div>
            <div
              class="form-ext-control form-ext-checkbox tooltip u-inline-block"
              data-tooltip="Used if a category is matched. If true, then replaces each string name in the array with the data object instead."
            >
              <input
                id="checkVerboseCategories"
                class="form-ext-input"
                type="checkbox"
                v-model="options.verboseCategories"
              />
              <label class="form-ext-label" for="checkVerboseCategories"
                >Verbose Categories</label
              >
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <label
                class="m-0 tooltip"
                for="selectResultLanguage"
                data-tooltip="Output language that you want your results to be in."
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
                class="m-0 tooltip"
                for="selectQueryLanguages"
                data-tooltip="Array of languages that your query will be searched in."
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
        </div>
      </div>
      <div class="col-6 col-sm-12" id="data">
        <div class="card m-1" v-if="code">
          <pre><code data-lang="JavaScript">{{ code }}</code></pre>
        </div>
        <div class="card m-1">
          <div
            v-if="dataLoad"
            class="u-flex u-items-center u-justify-center"
            style="background: linear-gradient(to right, rgb(142, 45, 226), rgb(74, 0, 224));"
          >
            <div class="animated loading hide-text loading-white">
              <p>Hidden</p>
            </div>
          </div>
          <VueJsonPretty
            class="p-1"
            :data="data"
            :deep="2"
            :showLength="true"
            v-else
          >
          </VueJsonPretty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as genshindb from "genshin-db";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default {
  components: {
    VueJsonPretty,
  },
  data() {
    return {
      data: null,
      query: "",
      options: {
        matchAltNames: false,
        matchAliases: false,
        matchCategories: false,
        verboseCategories: false,
        resultLanguage: "English",
        queryLanguages: ["English"],
      },
      content: "",
      subContent: "",
      code: null,

      dataLoad: false,
    };
  },
  computed: {
    languages() {
      return genshindb.Languages;
    },
    schema() {
      return {
        characters: [
          "all",
          "query",
          "rarity",
          "element",
          "weapontype",
          "substat",
          "gender",
          "region",
          "birthday",
          "costs",
        ],
        weapons: ["all", "query", "weapontype", "rarity", "substat", "costs"],
        artifacts: ["all", "query", "rarity"],
        weaponmaterialtypes: ["day", "region", "domainofforgery"],
        talentmaterialtypes: ["day", "region", "domainofmastery"],
        materials: [
          "all",
          "query",
          "rarity",
          "category",
          "materialtype",
          "dropdomain",
          "daysofweek",
        ],
        domains: [
          "all",
          "query",
          "region",
          "domainentrance",
          "domaintype",
          "recommendedelements",
          "daysofweek",
          "monsterlist",
        ],
        enemies: ["all", "query", "type", "category"],
      };
    },
  },
  mounted() {
    if (!this.content) this.content = Object.keys(this.schema)[0];
    if (!this.subContent && this.content)
      this.subContent = this.schema[this.content][0];
  },
  methods: {
    async fetchData() {
      return await genshindb[this.content.toLowerCase()](
        this.query,
        this.options
      );
    },
    generateCode() {
      let options = Object.entries(this.options).filter(
        ([key, value]) => key && value
      );
      this.code =
        "genshinDb." +
        this.content +
        '("' +
        this.query +
        '", ' +
        JSON.stringify(Object.fromEntries(options)) +
        ");";
    },
    getData() {
      if (this.content == "Characters") {
        if (this.subContent == "character") {
          console.log("character");
        }
      }
      if (this.subContent == "all") {
        this.options.matchCategories = true;
        this.query = "names";
      }
      this.dataLoad = true;
      this.fetchData().then((data) => {
        this.dataLoad = false;
        this.data = data;
      });
      this.generateCode();
    },
    setContent(content) {
      this.content = content;
      this.subContent = this.subContents[content.toLowerCase()][0];
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
