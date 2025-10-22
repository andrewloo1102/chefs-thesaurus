import { searchSubstitutions } from "@chefs-thesaurus/core";

function main() {
  console.log("🧪 Testing substitution cases...\n");
  
  const testCases = [
    { ingredient: "sour cream", quantity: 1, unit: "cup" },
    { ingredient: "butter", quantity: 4, unit: "tbsp" },
    { ingredient: "garlic clove", quantity: 2, unit: "unit" },
    { ingredient: "crema agria", quantity: 1, unit: "cup" },
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.ingredient} ${testCase.quantity} ${testCase.unit}`);
    
    const result = searchSubstitutions(testCase);
    
    if (result.supported) {
      console.log(`  ✅ Supported: ${result.base} → ${result.substitute}`);
      if (result.quantity !== undefined && result.unit) {
        console.log(`  📊 Quantity: ${result.quantity} ${result.unit}`);
      }
      if (result.notes) {
        console.log(`  📝 Notes: ${result.notes}`);
      }
    } else {
      console.log(`  ❌ Not supported: ${result.message}`);
      if (result.examples.length > 0) {
        console.log(`  💡 Examples: ${result.examples.join(", ")}`);
      }
    }
    
    console.log();
  });
}

main();
