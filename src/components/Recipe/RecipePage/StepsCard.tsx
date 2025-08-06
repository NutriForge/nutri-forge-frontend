import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Recipe } from '@/types/recipe';
import { getRecipe } from '@/services/recipeService';

export default function IngredientsCard() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { id } = useParams();

  useEffect(() => {
      if (!id) return;
  
      getRecipe(id)
        .then((data) => {
          setRecipe(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [id]);

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