import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import RecipeCard from './RecipeCard';

import { getRecipes } from '../../services/recipeService';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getRecipes()
      .then(setRecipes);
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 sm:text-3xl pb-4">Рецепти</h2>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        {recipes.map((recipe) => (
          <li className="rounded overflow-hidden min-h-0 hover:shadow-lg" key={recipe.id}>
            <Link className="block" to={`/recipe/${recipe.id}`}>
              <RecipeCard 
                name={recipe.name} 
                rating={recipe.rating}
                portion={recipe.weight_per_portion} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;