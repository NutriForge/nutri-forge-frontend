import { Recipe, IngredientForm, IngredientInfo } from "../types/recipe";

export const BACKEND_URL = "http://localhost:8082";
export const IMAGE_BASE_URL = `${BACKEND_URL}`;

export async function getAllRecipes(): Promise<Recipe[]>  {
  return await fetch(`${BACKEND_URL}/recipes?limit=100&offset=0`)
  .then((response) => {
    return response.json();
  })
}

export async function getRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`${BACKEND_URL}/recipe/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recipe with id ${id}`);
  }

  return response.json();
}

export async function getIngredientsInfo(names: string[]): Promise<IngredientInfo[]> {
  const response = await fetch(`${BACKEND_URL}/ingredients/get`, {
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
  const response = await fetch(`${BACKEND_URL}/ingredients/validate`, {
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

  const response = await fetch(`${BACKEND_URL}/ingredients/save`, {
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

  const response = await fetch(`${BACKEND_URL}/gemini/recipe/parse`, {
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

export async function saveRecipeWithImage(recipeData: any, imageFile: File | null): Promise<string> {
  const formData = new FormData();

  if (imageFile) {
    formData.append("image", imageFile);
  }

  formData.append("recipe", JSON.stringify(recipeData));

  const response = await fetch(`${BACKEND_URL}/recipe/save`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Не вдалося зберегти рецепт");
  }

  const data = await response.json();
  return data.id;
}