import * as queryString from "query-string";

export const hashDict = { ...queryString.parse(location.hash) };
console.log("hashDict", hashDict);
