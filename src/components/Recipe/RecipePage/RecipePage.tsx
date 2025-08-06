import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipe, useIsRecipesLoading } from "@/context/RecipeContext";
import { useIngredientsForm } from "@/context/IngredientsFormContext";

import IngredientsCard from "./IngredientsCard/IngredientsCard";
import StepsCard from "./StepsCard";
import { Button } from "@/components/ui/button";
import { getRecipe } from "@/services/recipeService";

import { IMAGE_BASE_URL } from "@/services/recipeService";

function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isLoading = useIsRecipesLoading();

  const recipe = useRecipe(id || "");

  const { dispatch } = useIngredientsForm();

  useEffect(() => {
    if (!id) return;
    getRecipe(id)
      .then((data) => {
        dispatch({ type: "SET_INGREDIENTS", payload: data.ingredients ?? [] });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  if (isLoading) {
    return <div>Завантаження…</div>;
  }

  if (!recipe) {
    return <div>Рецепт не знайдено</div>;
  }

  const { state } = useIngredientsForm();

  function handleAddToMealPlan() {
    const currentPlan = JSON.parse(localStorage.getItem("mealPlan") || "{}");

    const updatedRecipe = {
      ...recipe,
      ingredients: state.ingredients,
      weight_per_portion: state.totalWeight,
      total_proteins: state.totalMacros.proteins,
      total_carbs: state.totalMacros.carbs,
      total_fats: state.totalMacros.fats,
      total_kcal: state.totalMacros.kcal,
    };

    const newBreakfast = [
      ...(currentPlan.breakfast || []).filter((r: any) => r.id !== recipe!.id),
      updatedRecipe,
    ];

    const updatedPlan = {
      ...currentPlan,
      breakfast: newBreakfast,
    };

    localStorage.setItem("mealPlan", JSON.stringify(updatedPlan));
    console.log("Updated Recipe:", updatedRecipe);
    console.log("Updated Plan:", updatedPlan);

    navigate("/planner");
  }

  return (
    <div>
      <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {recipe.name}
            </h2>

            <p className="hidden text-gray-500 md:mt-4 md:block">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
              egestas tempus tellus etiam sed. Quam a scelerisque amet
              ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
              quisque ut interdum tincidunt duis.
            </p>
          </div>
          <button
            onClick={handleAddToMealPlan}
            className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-xl transition"
          >
            Додати в план
          </button>
        </div>

        <img
          alt=""
          src={
            recipe.img
              ? `${IMAGE_BASE_URL}${recipe.img}`
              : "https://placehold.co/400?text=Фотосесія+рецепту+триває"
          }
          className="h-56 w-full object-cover sm:h-full"
        />
      </section>

      <div className="mt-10 overflow-hidden sm:grid sm:grid-cols-2">
        <div>
          <IngredientsCard recipe={recipe} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl pb-4">
            Кроки
          </h2>
          <StepsCard />
          <div className="mt-6 flex justify-end">
            <Button onClick={handleAddToMealPlan} className="h-12 rounded-xl">
              Додати в план
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
