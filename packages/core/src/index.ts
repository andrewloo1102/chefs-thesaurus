// Public API for @chefs-thesaurus/core

export {
  searchSubstitutions,
  describeEffects,
  lookupStores,
  type SearchArgs,
  type SearchResult,
  type EffectsArgs,
  type EffectsResult,
  type StoreLookupArgs,
  type Store,
} from "./substitutions";

export {
  canonUnit,
  toMl,
  fromMl,
  round,
  type SupportedUnit,
  type Quantity,
} from "./units";

export {
  resolveCanonical,
  getAllowlist,
  examples,
  type CanonicalIngredient,
} from "./canonical";

