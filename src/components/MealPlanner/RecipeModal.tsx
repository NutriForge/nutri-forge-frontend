import { useEffect } from "react";
import { MealPlan, Recipe } from "@/types/recipe";
import IngredientsCard from "../Recipe/RecipePage/IngredientsCard/IngredientsCard";
import { useIngredientsForm } from "@/context/IngredientsFormContext";
import { calculateTotalMacros } from "@/util/recipeCalculations";

export default function RecipeModal({mealType, recipe, onClose, onSaveRecipe}:
  {
    recipe: Recipe;
    mealType: keyof MealPlan;
    onClose: () => void;
    onSaveRecipe: (mealType: keyof MealPlan, recipe: Recipe) => void;
  }
) {
  const { state, dispatch } = useIngredientsForm();
  
  const handleSave = () => {
    const updatedMacros = calculateTotalMacros(state.ingredients);
    const updatedRecipe: Recipe = {
      ...recipe,
      ingredients: state.ingredients,
      total_kcal: updatedMacros.kcal,
      total_proteins: updatedMacros.proteins,
      total_fats: updatedMacros.fats,
      total_carbs: updatedMacros.carbs,
    };

    onSaveRecipe(mealType, updatedRecipe); // віддаємо наверх
    onClose(); // закриваємо модалку
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="w-[600px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h2
            id="modalTitle"
            className="text-xl font-bold text-gray-900 sm:text-2xl"
          >
            {recipe.name}
          </h2>

          <button
            type="button"
            className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6">
          <IngredientsCard recipe={recipe} />
        </div>


        <footer className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            onClick={onClose}
          >
            Відміна
          </button>

          <button
            type="button"
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
            onClick={handleSave}
          >
            Зберегти
          </button>
        </footer>
      </div>
    </div>
  );
}
