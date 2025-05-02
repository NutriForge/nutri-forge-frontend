import { Ingredient } from '../types/recipe';

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
    carbs:  Math.round(ing.carbs * ratio),
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