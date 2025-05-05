type IngredientInfo = {
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
  weight_per_portion: number;
  rating: number;
  img: string;
  ingredients: Ingredient[];
  steps: Step[];
}