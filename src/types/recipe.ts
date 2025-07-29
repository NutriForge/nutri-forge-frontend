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
  proteins: number;
  carbs: number;
  fats: number;
  kcal: number;
}

export interface IngredientForm {
  name: string;
  proteins: string;
  fats: string;
  carbs: string;
  kcal: string;
}

export interface Step {
  id: number;
  description: string;
}

export interface Recipe {
  id: string;
  name: string;
  type?: string;
  rating?: number;
  img: string;
  ingredients?: Ingredient[];
  steps?: Step[];
  weight_per_portion?: number;
  total_proteins?: number;
  total_fats?: number;
  total_carbs?: number;
  total_kcal?: number;
}

export interface MealPlan {
  breakfast: Recipe[];
  lunch: Recipe[];
  dinner: Recipe[];
};

export interface OpenFoodNutriments {
  "energy-kcal": number;
  "carbohydrates": number;
  "fat": number;
  "proteins": number;
}
export interface OpenFoodIngredient {
  id: number;
  product_name: string;
  image_front_url: string;
  weight_per_portion: number;
  nutriments: OpenFoodNutriments;
}