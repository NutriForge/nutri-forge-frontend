import { Recipe, IngredientForm, IngredientInfo } from "../types/recipe";

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

export async function getIngredientsInfo(names: string[]): Promise<IngredientInfo[]> {
  const response = await fetch("http://localhost:8082/ingredients/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ names }),
  });

  if (!response.ok) {
    throw new Error("Unable to get macros from the database");
  }

  return await response.json();
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

export async function saveIngredients(ingredients: IngredientForm[]): Promise<void> {
  const cleaned = ingredients.map((ing) => ({
    name: ing.name,
    proteins: parseFloat(ing.proteins),
    fats: parseFloat(ing.fats),
    carbs: parseFloat(ing.carbs),
    kcal: parseFloat(ing.kcal),
  }));

  const response = await fetch("http://localhost:8082/ingredients/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleaned),
  });

  if (!response.ok) {
    throw new Error("Не вдалося зберегти інгредієнти");
  }

  console.log(JSON.stringify(cleaned));

}

export async function parseRecipe(title: string, recipeText: string): Promise<Recipe> {
  console.log(JSON.stringify({ title, recipeText }))

  const response = await fetch("http://localhost:8082/gemini/recipe/parse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, recipeText }),
  });

  

  if (!response.ok) {
    throw new Error("Unable to send recipe");
  }

  const data = await response.json();
  return data as Recipe;
}