import { Recipe, MealPlan } from "@/types/recipe";

export function addRecipeToMealPlan(recipe: Recipe, mealType: keyof MealPlan = "breakfast") {
  const currentPlan: MealPlan = JSON.parse(localStorage.getItem("mealPlan") || "{}");

  const updatedSection = [...(currentPlan[mealType] || [])];

  const newRecipe = {
    ...recipe
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
