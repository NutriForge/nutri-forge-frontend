export interface Ingredient {
  name: string;
  number: number;
  weight_in_g: number;
  protein_per_100g?: number;
  fat_per_100g?: number;
  carbs_per_100g?: number;
  kcal_per_100g?: number;
}

export interface Step {
  id: number;
  description: string;
}

export interface Recipe {
  id: number;
  name: string;
  type: string;
  weight_per_portion: number;
  rating: number;
  ingredients: Ingredient[];
  steps: Step[];
}