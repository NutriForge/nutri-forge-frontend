/**
 * 📄 IngredientsFormContext.tsx
 *
 * Context for managing the state of the ingredients editing form.
 * Holds the user’s changes to ingredient weights, total weight and macros,
 * and settings like whether the ingredients are locked and whether the macros panel is open.
 *
 * 📝 Features:
 * - Stores a working copy of the ingredients for the current recipe
 * - Tracks the total weight and recalculates macros
 * - Supports proportional scaling when ingredients are "locked"
 * - Toggle for opening/closing the macros panel
 *
 * Provided hooks:
 * - `useIngredientsForm()`
 */
import { createContext, useReducer, useContext, ReactNode } from 'react';
import { calculateTotalMacros, calculateTotalWeight, scaleIngredients } from '@/util/recipeCalculations';
import { Ingredient } from '@/types/recipe';

/**
 * Initial state of the form.
 */
const initialState = {
  ingredients: [] as Ingredient[],
  totalWeight: 0,
  totalMacros: { proteins: 0, carbs: 0, fats: 0, kcal: 0 },
  isLocked: true,
  isMacrosOpen: false,
};

type State = typeof initialState;


/**
 * Action types for the reducer.
 */
type Action =
  | { type: 'SET_INGREDIENTS'; payload: Ingredient[] }
  | { type: 'UPDATE_INGREDIENT'; index: number; newWeight: number }
  | { type: 'UPDATE_TOTAL_WEIGHT'; payload: number }
  | { type: 'TOGGLE_LOCK' }
  | { type: 'TOGGLE_MACROS_OPEN' };

/**
 *  Reducer function
 *
 * Handles state updates based on dispatched actions.
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INGREDIENTS': {
      console.log('SET_INGREDIENTS')
      console.log(action.payload)
      const total = calculateTotalWeight(action.payload);
      console.log('Weight')
      console.log(total)
      const macros = calculateTotalMacros(action.payload);
      console.log('Macros')
      console.log(macros)
      return { ...state, ingredients: action.payload, totalWeight: total, totalMacros: macros };
    }

    case 'UPDATE_INGREDIENT': {
      console.log("before")
      console.log(state.ingredients)
      const original = state.ingredients[action.index];
      const updated = state.isLocked
        ? scaleIngredients(state.ingredients, original.weight_in_g, action.newWeight)
        : state.ingredients.map((ing, i) =>
            i === action.index ? { ...ing, weight_in_g: action.newWeight } : ing
          );
      console.log("after")
      console.log(updated)
      console.log(calculateTotalMacros(updated))
      return {
        ...state,
        ingredients: updated,
        totalWeight: calculateTotalWeight(updated),
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
        totalWeight: action.payload,
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

/**
 * Utility to throw if hook is used outside of the provider.
 */
function throwError(): never {
  throw new Error("useIngredientsForm must be used within IngredientsFormProvider");
}

/**
 * The actual context.
 */
const IngredientsFormContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: throwError,
});

/**
 * IngredientsFormProvider
 *
 * Provider for IngredientsFormContext.
 * Wraps components that need to edit or view the working state of ingredients.
 */
export function IngredientsFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <IngredientsFormContext.Provider value={{ state, dispatch }}>
      {children}
    </IngredientsFormContext.Provider>
  );
}

/**
 * useIngredientsForm
 *
 * Hook to access the ingredients form state and dispatch function.
 * @returns { state, dispatch }
 */
export function useIngredientsForm() {
  return useContext(IngredientsFormContext);
}
