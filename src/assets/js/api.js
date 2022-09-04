const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * Fetches data from api.
 *
 * @param {string} folder
 * @param {string} category
 * @param {string} query
 * @param {Dict} options
 *
 * */
export default function getUrl(folder, query, options) {
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
