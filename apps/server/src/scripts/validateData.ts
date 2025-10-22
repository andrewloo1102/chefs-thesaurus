import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

const RatioSchema = z.object({
  mode: z.literal("multiplier"),
  value: z.number(),
  basis: z.enum(["volume", "unit"]),
});

const AlternativeSchema = z.object({
  substitute: z.string(),
  ratio: RatioSchema,
  notes: z.string().optional(),
  tips: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
});

const EntrySchema = z.object({
  base: z.string(),
  synonyms: z.array(z.string()).optional(),
  alternatives: z.array(AlternativeSchema),
});

const DataSchema = z.array(EntrySchema);

function main() {
  // Navigate from apps/server/src/scripts -> project root -> packages/core/data
  const dataPath = path.join(__dirname, "../../../../packages/core/data/substitutions.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  
  try {
    const data = JSON.parse(raw);
    const result = DataSchema.safeParse(data);
    
    if (!result.success) {
      console.error("❌ Schema validation failed:");
      result.error.errors.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    
    console.log("✅ Schema validation passed!");
    console.log(`📊 Total entries: ${data.length}`);
    
    // Count volume vs unit mappings
    let volumeCount = 0;
    let unitCount = 0;
    
    data.forEach((entry) => {
      entry.alternatives.forEach((alt) => {
        if (alt.ratio.basis === "volume") volumeCount++;
        if (alt.ratio.basis === "unit") unitCount++;
      });
    });
    
    console.log(`📈 Volume mappings: ${volumeCount}`);
    console.log(`📈 Unit mappings: ${unitCount}`);
    console.log(`📈 Total alternatives: ${volumeCount + unitCount}`);
    
  } catch (error) {
    console.error("❌ Failed to load or parse data:", error);
    process.exit(1);
  }
}

main();
