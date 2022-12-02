const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;
import gdbapiConfig from "@/assets/js/gdbapiConfig.json";

/**
 * Fetches data from api.
 *
 * @param {string} folder
 * @param {string} category
 * @param {string} query
 * @param {Dict} options
 *
 * */
export const getUrl = function(folder, query, options) {
  var url = baseUrl + folder;
  if (query) {
    var params = "query=" + query;
    if (options) {
      const optionsObject = JSON.parse(JSON.stringify(options));
      for (let option in optionsObject) {
        params += "&" + option + "=" + options[option];
      }
    }
    url += "?" + params;
  }
  return url;
}

/**
 * Returns a deep copy of the default options for genshin-db-api.
 * */
export const getDefaultOptions = function() {
  return JSON.parse(JSON.stringify(gdbapiConfig.defaultOptions));
}

/**
 * Returns a shallow copy of the languages available for genshin-db-api.
 * */
export const getLanguages = function() {
  return gdbapiConfig.languages;
}