import { useEffect } from 'react';
import { useIngredientsForm } from '@/context/IngredientsFormContext';
import { IngredientsHeader } from './IngredientsHeader/IngredientsHeader';
import { IngredientList } from './IngredientsList/IngredientsList';
import { TotalBlock } from './IngredientsFooter/TotalBlock';
import { Recipe } from '@/types/recipe';

export default function IngredientsCard({
  recipe,
}: {
  recipe: Recipe;
}) {
  const { state, dispatch } = useIngredientsForm();
  const { isMacrosOpen } = state;

  // ініціалізуємо інгредієнти з переданого рецепта
  useEffect(() => {
    if (recipe) {
      dispatch({ type: 'SET_INGREDIENTS', payload: recipe.ingredients ?? [] });
    }
  }, [recipe, dispatch]);

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
        <TotalBlock handleTotalWeight={handleTotalWeight} />
      </div>
    </div>
  );
}
