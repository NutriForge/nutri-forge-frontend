import { Recipe } from "../types/recipe";

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

export async function validateIngredients(ingredientNames: string[]): Promise<string[]> {
  const response = await fetch("http://localhost:8082/ingredients/validate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ names: ingredientNames }),
  });

  if (!response.ok) {
    throw new Error("Failed to validate ingredients");
  }

  const data = await response.json();
  return data.missing || [];
}