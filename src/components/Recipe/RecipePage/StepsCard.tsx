import { useParams } from "react-router-dom";
import { useRecipes } from "../../../context/RecipeContext";

export default function IngredientsCard() {
  const { id } = useParams();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));

  if (!recipe) {
    return <div className="p-4 text-red-500">Рецепт не знайдено</div>;
  }

  return (
      <div className="p-4">
        <ul className="space-y-2 text-m text-gray-700">
          {(recipe.steps?? []).map((steps, index) => (
            <li key={index} className="flex pb-1">
              <div>
              <h3 className="block text-xl font-semibold text-black mb-2">Крок {steps.id}</h3>
              <span>{steps.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
  );
}