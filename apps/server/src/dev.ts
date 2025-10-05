import { searchSubstitutions, describeEffects, lookupStores } from "./index";

void (async function main() {
  // ensure the exports are usable
  console.log("debug:", {
    searchSubstitutions: typeof searchSubstitutions,
    describeEffects: typeof describeEffects,
    lookupStores: typeof lookupStores,
  });
  if (!searchSubstitutions || !describeEffects || !lookupStores) {
    throw new Error("Exports missing");
  }
  console.log("[The Chef’s Thesaurus] functions ready: searchSubstitutions, describeEffects, lookupStores");
})();

