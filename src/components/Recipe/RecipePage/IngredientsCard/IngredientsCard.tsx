import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIngredientsForm } from '@/context/IngredientsFormContext';
import { useRecipes } from '@/context/RecipeContext';
import {IngredientsHeader} from './IngredientsHeader/IngredientsHeader';
import {IngredientList} from './IngredientsList/IngredientsList';
import {TotalBlock} from './IngredientsFooter/TotalBlock';
import { Recipe } from '@/types/recipe';

export default function IngredientsCard({
  recipe: propRecipe 
  }: { 
    recipe?: Recipe;
  }) {
  const { id } = useParams();
  const { state, dispatch } = useIngredientsForm();
  const { isMacrosOpen } = state;
  const recipes = useRecipes();

  const recipe = propRecipe ?? recipes.find((r) => r.id === Number(id));

  useEffect(() => {
    if (recipe) {
      dispatch({ type: 'SET_INGREDIENTS', payload: recipe.ingredients ?? [] });
    }
  }, [recipe]);

  const handleIngredientChange = (index: number, newWeight: number) => {
    dispatch({ type: 'UPDATE_INGREDIENT', index, newWeight });
  };

  const handleTotalWeight = (newWeight: number) => {
    dispatch({ type: 'UPDATE_TOTAL_WEIGHT', payload: newWeight });
  };

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <IngredientsHeader
        onTitleClick={() => dispatch({ type: 'TOGGLE_MACROS_OPEN' })}
        onChangeLock={() => dispatch({ type: 'TOGGLE_LOCK' })}
      />
      <div className="p-4">
        <IngredientList
          onChange={handleIngredientChange}
          showMacros={isMacrosOpen}
        />
        <TotalBlock
          handleTotalWeight={handleTotalWeight}
        />
      </div>
    </div>
  );
}
