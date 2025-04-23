import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useRecipes } from '../../../context/RecipeContext';

export default function IngredientsCard() {
  const { id } = useParams();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  console.log(recipe)

  useEffect(() => {
    if (recipe) {
      setIngredients(recipe.ingredients);
    }
  }, [recipe]);

  const handleChange = (index: number, newWeight: number) => {
    const updated = [...ingredients];
    updated[index].weight_in_g = newWeight;
    setIngredients(updated);
  };

  const totalWeight = ingredients.reduce((sum, ing) => sum + ing.weight_in_g, 0);

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <div className="flex border-b  bg-gray-50">
        <h2 className='flex-1 py-2 text-m text-center font-semibold border-b-2 border-black text-black'>Інгридієнти</h2>
      </div>

      <div className="p-4">
        <ul className="space-y-2 text-sm text-gray-700">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="flex justify-between items-center border-b pb-1 gap-2">
            <span className="w-1/2">{ingredient.name}</span>
            <div>
            <input
              type="number"
              value={ingredient.weight_in_g}
              onChange={(e) => handleChange(index, Number(e.target.value))}
              className="w-15 border rounded px-1 py-0.5 justify-end"/>
            <span className="ml-2">г</span>
            </div>
          </li>
          ))}
        </ul>
        <div className="text-right font-semibold text-sm text-gray-900 mt-3">
          Загальна вага: {totalWeight} г
        </div>
      </div>
    </div>
  );
}