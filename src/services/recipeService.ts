import { Recipe, IngredientForm, IngredientInfo } from "@/types/recipe";

export const BACKEND_URL = import.meta.env.VITE_API_URL;
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_S3_URL;

export async function getAllRecipes(): Promise<Recipe[]>  {
  return await fetch(`${BACKEND_URL}/api/recipes?limit=100&offset=0`)
  .then((response) => {
    return response.json();
  })
}

export async function getRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`${BACKEND_URL}/api/recipe/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch recipe with id ${id}`);
  }

  return response.json();
}

// delete recipe; 204 expected
export async function deleteRecipe(id: string): Promise<void> { 
  console.warn("deleteRecipe not implemented yet", id);
  return;
}

// set rating; returns updated aggregates: { avg_rating, rating_count, user_rating }
export async function setRecipeRating(id: string, stars: number): Promise<{avg_rating:number; rating_count:number; user_rating:number}> { 
  console.warn("setRecipeRating not implemented yet", id, stars);
  return {
    avg_rating: 0,
    rating_count: 0,
    user_rating: stars,
  };
 }

// favorites toggles
export async function addFavorite(id: string): Promise<void> { 
  console.warn("addFavorite not implemented yet", id);
  return;
}
export async function removeFavorite(id: string): Promise<void> { 
  console.warn("removeFavorite not implemented yet", id);
  return; 
}

// returns { img: string } with a relative path like "/images/recipe_8.png"
export async function uploadRecipeImage(id: string, file: File): Promise<{ img: string }> {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("image", file);

  const res = await fetch(`${BACKEND_URL}/api/recipe/image`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Failed to upload image: ${await res.text()}`);
  }

  return res.json();
}

export async function deleteRecipeImage(id: string): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/api/recipe/image?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete image: ${await res.text()}`);
  }
}

export async function getIngredientsInfo(names: string[]): Promise<IngredientInfo[]> {
  const response = await fetch(`${BACKEND_URL}/api/ingredients/get`, {
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
  const response = await fetch(`${BACKEND_URL}/api/ingredients/validate`, {
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

  const response = await fetch(`${BACKEND_URL}/api/ingredients/save`, {
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

  const response = await fetch(`${BACKEND_URL}/api/gemini/recipe/parse`, {
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

  const response = await fetch(`${BACKEND_URL}/api/recipe/save`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Не вдалося зберегти рецепт");
  }

  const data = await response.json();
  return data.id;
}

export async function updateRecipeSteps(
  recipeId: string,
  steps: { id?: number | null; step_number: number; description: string }[]
): Promise<{ steps: { id: number; step_number: number; description: string }[] }> {
  console.warn("updateRecipeSteps not implemented yet", recipeId, steps);

  return {
    steps: steps.map((step, index) => ({
      id: step.id ?? index + 1,
      step_number: step.step_number,
      description: step.description,
    })),
  };
}