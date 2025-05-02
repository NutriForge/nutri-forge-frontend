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
  }));
}