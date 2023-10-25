import gdbapiConfig from "@/assets/json/gdbapiConfig.json";

// @ts-ignore
const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * Fetches data from api.
 *
 * @param {string} folder
 * @param {string} category
 * @param {string} query
 * @param {Options} options
 *
 * */
export const getUrl = function (folder: string, query: string, options: any) {
  var url = baseUrl + folder;
  var params = "query=" + query;

  if (options) {
    const optionsObject = JSON.parse(JSON.stringify(options));
    for (let option in optionsObject) {
      params += "&" + option + "=" + options[option];
    }
  }
  url += "?" + params;

  return url;
};

/**
 * Returns a deep copy of the default options for genshin-db-api.
 * */
export const getDefaultOptions = function () {
  return JSON.parse(JSON.stringify(gdbapiConfig.defaultOptions));
};

/**
 * Returns a shallow copy of the languages available for genshin-db-api.
 * */

export const getLanguages = function () {
  return JSON.parse(JSON.stringify(gdbapiConfig.languages));
};
