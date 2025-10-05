import { searchSubstitutions } from "./index";

const out = searchSubstitutions({ ingredient: "sour cream", quantity: 1, unit: "cup", dish: "Cold topping" });
console.log(JSON.stringify(out, null, 2));



