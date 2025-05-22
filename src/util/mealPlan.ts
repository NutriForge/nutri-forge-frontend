import { Recipe, MealPlan } from "@/types/recipe";

export function addRecipeToMealPlan(recipe: Partial<Recipe>, mealType: keyof MealPlan = "breakfast") {
  const currentPlan: MealPlan = JSON.parse(localStorage.getItem("mealPlan") || "{}");

  const updatedSection = [...(currentPlan[mealType] || [])];

  const newRecipe = {
    id: recipe.id?.toString() || Date.now().toString(),
    name: recipe.name || "Без назви",
    image: recipe.img || recipe.image || "https://placehold.co/80",
    kcal: recipe.total_kcal ?? recipe.kcal ?? 0,
    proteins: recipe.total_proteins ?? recipe.proteins ?? 0,
    fats: recipe.total_fats ?? recipe.fats ?? 0,
    carbs: recipe.total_carbs ?? recipe.carbs ?? 0,
  };

  const existingIndex = updatedSection.findIndex((r) => r.id === newRecipe.id);

  if (existingIndex !== -1) {
    updatedSection[existingIndex] = newRecipe;
  } else {
    updatedSection.push(newRecipe);
  }

  const updatedPlan = {
    ...currentPlan,
    [mealType]: updatedSection,
  };

  localStorage.setItem("mealPlan", JSON.stringify(updatedPlan));
}
