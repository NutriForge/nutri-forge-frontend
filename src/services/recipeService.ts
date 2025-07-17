import { Recipe, Ingredient } from "../types/recipe";

export async function getAllRecipes(): Promise<Recipe[]>  {
  return await fetch('http://localhost:8082/recipes?limit=100&offset=0')
  .then((response) => {
    return response.json();
  })
}

export async function getRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`http://localhost:8082/recipe/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recipe with id ${id}`);
  }

  return response.json();
}

export async function getAllIngredients(): Promise<Ingredient[]> {
  const response = await fetch('/data/ingredients.json');
  if (!response.ok) {
    throw new Error('Failed to fetch ingredients');
  }
  return response.json();
}