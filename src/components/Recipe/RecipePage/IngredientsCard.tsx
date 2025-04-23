import { useParams } from "react-router-dom";
import { useRecipes } from '../../../context/RecipeContext';

export default function IngredientsCard() {
  const { id } = useParams();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));
  console.log(recipe)

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <div className="flex border-b  bg-gray-50">
        <h2 className='flex-1 py-2 text-m text-center font-semibold border-b-2 border-black text-black'>Інгридієнти</h2>
      </div>

      <div className="p-4">
        <ul className="space-y-2 text-sm text-gray-700">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex justify-between border-b pb-1">
              <span>{ingredient.name}</span>
              <span>{ingredient.weight_in_g} г</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}