import { Ingredient, Recipe, IngredientInfo } from "../types/recipe";

export function enrichRecipesWithMacros(
  recipes: Recipe[],
  ingredientsInfo: IngredientInfo[]
): Recipe[] {
  return recipes.map((recipe) => {
    const enrichedIngredients = recipe.ingredients.map((ing) => {
      console.log("ingredientsInfo", ingredientsInfo);
      console.log("looking for:", ing.name);
      const info = ingredientsInfo.find((i) => {
        if (!i.name) return false;
      
        // якщо name — масив синонімів
        if (Array.isArray(i.name)) {
          return i.name.some((syn) =>
            syn.toLowerCase() === ing.name.toLowerCase()
          );
        }
      
        // fallback: якщо name — звичайний рядок
        return i.name.toLowerCase() === ing.name.toLowerCase();
      });

      if (!info) {
        console.warn("⚠️ No match for", ing.name);
        return ing;
      }

      const factor = ing.weight_in_g / 100;

      return {
        ...ing,
        proteins: +(info.proteins * factor).toFixed(2),
        carbs: +(info.carbs * factor).toFixed(2),
        fats: +(info.fats * factor).toFixed(2),
        kcal: +(info.kcal * factor).toFixed(2),
      };
    });

    return {
      ...recipe,
      ingredients: enrichedIngredients,
    };
  });
}

export function calculateTotalWeight(ingredients: Ingredient[]): number {
  return ingredients.reduce((sum, ing) => sum + ing.weight_in_g, 0);
}

export function scaleIngredients(
  ingredients: Ingredient[],
  originalValue: number,
  newValue: number
): Ingredient[] {
  const ratio = newValue / originalValue;

  return ingredients.map((ing) => ({
    ...ing,
    weight_in_g: Math.round(ing.weight_in_g * ratio),
    proteins: Math.round(ing.proteins * ratio),
    carbs: Math.round(ing.carbs * ratio),
    fats: Math.round(ing.fats * ratio),
    kcal: Math.round(ing.kcal * ratio),
  }));
}

export function calculateTotalMacros(ingredients: Ingredient[]) {
  return ingredients.reduce(
    (acc, ing) => ({
      proteins: acc.proteins + ing.proteins,
      carbs: acc.carbs + ing.carbs,
      fats: acc.fats + ing.fats,
      kcal: acc.kcal + ing.kcal,
    }),
    { proteins: 0, carbs: 0, fats: 0, kcal: 0 }
  );
}
