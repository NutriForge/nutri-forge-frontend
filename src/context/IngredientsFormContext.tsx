import { createContext, useReducer, useContext, ReactNode } from 'react';
import { calculateTotalMacros, calculateTotalWeight, scaleIngredients } from '@/util/recipeCalculations';
import { Ingredient } from '@/types/recipe';

const initialState = {
  ingredients: [] as Ingredient[],
  totalWeight: '0',
  totalMacros: { proteins: 0, carbs: 0, fats: 0, kcal: 0 },
  isLocked: true,
  isMacrosOpen: false,
};

type State = typeof initialState;

type Action =
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'UPDATE_INGREDIENT'; index: number; newWeight: number }
  | { type: 'UPDATE_TOTAL_WEIGHT'; payload: number }
  | { type: 'TOGGLE_LOCK' }
  | { type: 'TOGGLE_MACROS_OPEN' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INGREDIENTS': {
      const total = calculateTotalWeight(action.payload);
      const macros = calculateTotalMacros(action.payload);
      return { ...state, ingredients: action.payload, totalWeight: String(total), totalMacros: macros };
    }

    case 'UPDATE_INGREDIENT': {
      const original = state.ingredients[action.index];
      const updated = state.isLocked
        ? scaleIngredients(state.ingredients, original.weight_in_g, action.newWeight)
        : state.ingredients.map((ing, i) =>
            i === action.index ? { ...ing, weight_in_g: action.newWeight } : ing
          );
      return {
        ...state,
        ingredients: updated,
        totalWeight: String(calculateTotalWeight(updated)),
        totalMacros: calculateTotalMacros(updated),
      };
    }

    case 'UPDATE_TOTAL_WEIGHT': {
      const updated = scaleIngredients(
        state.ingredients,
        calculateTotalWeight(state.ingredients),
        action.payload
      );
      return {
        ...state,
        ingredients: updated,
        totalWeight: String(action.payload),
        totalMacros: calculateTotalMacros(updated),
      };
    }

    case 'TOGGLE_LOCK':
      return { ...state, isLocked: !state.isLocked };

    case 'TOGGLE_MACROS_OPEN':
      return { ...state, isMacrosOpen: !state.isMacrosOpen };

    default:
      return state;
  }
}

// Без | undefined
function throwError(): never {
  throw new Error("useIngredientsForm must be used within IngredientsFormProvider");
}

const IngredientsFormContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: throwError,
});

export function IngredientsFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <IngredientsFormContext.Provider value={{ state, dispatch }}>
      {children}
    </IngredientsFormContext.Provider>
  );
}

export function useIngredientsForm() {
  return useContext(IngredientsFormContext);
}
