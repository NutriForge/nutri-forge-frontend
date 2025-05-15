import { Ingredient, Recipe, IngredientInfo } from "../types/recipe";

export function enrichRecipesWithMacros(
  recipes: Recipe[],
  ingredientsInfo: IngredientInfo[]
): Recipe[] {
  return recipes.map((recipe) => {
    const enrichedIngredients = recipe.ingredients.map((ing) => {
      const info = ingredientsInfo.find((i) => {
        if (!i.name) return false;

        if (Array.isArray(i.name)) {
          return i.name.some((syn) =>
            syn.toLowerCase() === ing.name.toLowerCase()
          );
        }

        return i.name.toLowerCase() === ing.name.toLowerCase();
      });

      if (!info) {
        console.warn("⚠️ No match for", ing.name);
        return {
          ...ing,
          proteins: 0,
          carbs: 0,
          fats: 0,
          kcal: 0,
        };
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

    const totals = enrichedIngredients.reduce(
      (acc, ing) => ({
        weight: acc.weight + ing.weight_in_g,
        proteins: acc.proteins + ing.proteins,
        carbs: acc.carbs + ing.carbs,
        fats: acc.fats + ing.fats,
        kcal: acc.kcal + ing.kcal,
      }),
      { weight: 0, proteins: 0, carbs: 0, fats: 0, kcal: 0 }
    );

    return {
      ...recipe,
      ingredients: enrichedIngredients,
      weight_per_portion: totals.weight,
      total_proteins: +totals.proteins.toFixed(2),
      total_carbs: +totals.carbs.toFixed(2),
      total_fats: +totals.fats.toFixed(2),
      total_kcal: +totals.kcal.toFixed(2),
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
    weight_in_g: ing.weight_in_g * ratio,
    proteins: ing.proteins * ratio,
    carbs: ing.carbs * ratio,
    fats: ing.fats * ratio,
    kcal: ing.kcal * ratio,
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
