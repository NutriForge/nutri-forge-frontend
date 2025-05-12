import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "../../../context/RecipeContext";

import IngredientsCard from "./IngredientsCard/IngredientsCard";
import StepsCard from "./StepsCard";
import { Button } from "@/components/ui/button";
import { useIngredientsForm } from "@/context/IngredientsFormContext";

function RecipePage() {
  const { id } = useParams();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));
  const { state } = useIngredientsForm();
  const { ingredients, totalMacros } = state;
  const navigate = useNavigate();

  if (!recipe) return <div>Рецепт не знайдено</div>;

  function handleAddToMealPlan() {

    console.log(recipe)
    const newRecipe = {
        id: recipe.id,
        name: recipe.name,
        img: recipe.img || "https://placehold.co/80?text=Фотосесія+рецепту+триває",
        ingredients: ingredients,
        weight_per_portion: totalMacros,
        total_proteins: totalMacros.proteins,
        total_fats: totalMacros.fats,
        total_carbs: totalMacros.carbs,
        total_kcal: totalMacros.kcal
    };

    const currentPlan = JSON.parse(localStorage.getItem("mealPlan") || "{}");
    const breakfast = currentPlan.breakfast || [];
    breakfast.push(newRecipe);
    localStorage.setItem("mealPlan", JSON.stringify({ ...currentPlan, breakfast }));
    navigate("/planner");
  };

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
          <button onClick={handleAddToMealPlan} className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-xl transition">
            Додати в план
          </button>
        </div>

        <img
          alt=""
          src={
            recipe.img ||
            "https://placehold.co/400x300?text=Фотосесія+рецепту+триває"
          }
          className="h-56 w-full object-cover sm:h-full"
        />
      </section>
      <div className="mt-10 overflow-hidden sm:grid sm:grid-cols-2">
        <div>
          <IngredientsCard />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl pb-4">
            Кроки
          </h2>
          <StepsCard />
          <div className="mt-6 flex justify-end">
            <Button onClick={handleAddToMealPlan} className="h-12 rounded-xl">Додати в план</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
