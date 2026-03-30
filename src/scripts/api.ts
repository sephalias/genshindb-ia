import gdbapiConfig from "@/assets/json/gdbapiConfig.json";

// @ts-ignore
const baseUrl = import.meta.env.VITE_APP_API_BASE_URL;

type Options = Record<
  string,
  string | number | boolean | Array<string | number>
>;

/**
 * Build a safe URL for the API.
 * @param folder The API folder (e.g. "characters")
 * @param query The main query string
 * @param options Optional query options
 */
export const getUrl = function (
  folder: string,
  query: string,
  options?: Options,
) {
  const base = String(baseUrl || "").trim();
  const cleanFolder = String(folder || "").replace(/^\/+/, "");

  const params = new URLSearchParams();
  if (query !== undefined && query !== null && String(query) !== "")
    params.append("query", String(query));

  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, String(v));
      } else {
        params.append(key, String(value));
      }
    }
  }

  if (base) {
    const baseWithSlash = base.endsWith("/") ? base : base + "/";
    const u = new URL(cleanFolder, baseWithSlash);
    const p = params.toString();
    if (p) u.search = p;
    return u.toString();
  }

  // Fallback to relative path
  let url = "/" + cleanFolder;
  const p = params.toString();
  if (p) url += "?" + p;
  return url;
};

/**
 * Returns a deep copy of the default options for genshin-db-api.
 */
export const getDefaultOptions = function () {
  return JSON.parse(JSON.stringify(gdbapiConfig.defaultOptions));
};

/**
 * Returns a copy of the languages available for genshin-db-api.
 */
export const getLanguages = function () {
  return Array.isArray(gdbapiConfig.languages)
    ? [...gdbapiConfig.languages]
    : JSON.parse(JSON.stringify(gdbapiConfig.languages));
};
