export interface IngredientInfo {
  name: string;
  proteins: number;
  carbs: number;
  fats: number;
  kcal: number;
};
export interface Ingredient {
  name: string;
  number: number;
  weight_in_g: number;
  proteins?: number;
  carbs?: number;
  fats?: number;
  kcal?: number;
}

export interface Step {
  id: number;
  description: string;
}

export interface Recipe {
  id: number;
  name: string;
  type: string;
  rating: number;
  img: string;
  ingredients: Ingredient[];
  steps: Step[];
  weight_per_portion?: number;
  total_proteins?: number;
  total_fats?: number;
  total_carbs?: number;
  total_kcal?: number;
}