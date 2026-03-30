/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    throw new TypeError("getRandomInt: min and max must be finite numbers");
  }
  const minCeil = Math.ceil(min);
  const maxFloor = Math.floor(max);
  if (maxFloor < minCeil) {
    throw new RangeError(
      "getRandomInt: max must be >= min after integer coercion",
    );
  }
  return Math.floor(Math.random() * (maxFloor - minCeil + 1)) + minCeil;
}

/* 
   Asset Loader
*/
export function getImageUrl(path: string): string {
  if (typeof path !== "string")
    throw new TypeError("getImageUrl: path must be a string");
  // Strip any leading slashes so URL resolves relative to ../assets
  const clean = path.replace(/^\/+/, "");
  return new URL(`../assets/${clean}`, import.meta.url).href;
}
