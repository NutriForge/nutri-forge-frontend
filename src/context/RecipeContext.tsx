/**
 * 📄 RecipeContext.tsx
 *
 * Context for storing the global list of recipes (summary) and the loading state.
 * Used for rendering the recipe list and accessing basic recipe information.
 *
 * 📝 Features:
 * - Fetches `getAllRecipes()` on mount
 * - Holds `recipes` (summary — without ingredients/steps)
 * - Holds `isLoading`
 * - Provides hooks: `useRecipes`, `useIsRecipesLoading`, `useRecipe`
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAllRecipes } from '@/services/recipeService';
import { Recipe } from '@/types/recipe';

/**
 * The shape of the context value.
 */
interface RecipeContextType {
  recipes: Recipe[]; // List of all recipes (summary only)
  isLoading: boolean; // Whether recipes are still loading
}

/**
 * Default value for the context.
 */
const defaultValue: RecipeContextType = {
  recipes: [],
  isLoading: true
};

/**
 * The actual React context.
 */
const RecipeContext = createContext<RecipeContextType>(defaultValue);

/**
 * RecipeProvider
 *
 * Provides the `RecipeContext` to all child components.
 * Loads the list of recipes from the backend when mounted.
 */
export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      const recipes = await getAllRecipes();
      console.log("Loaded recipes:", recipes);
      setRecipes(recipes);
      setIsLoading(false);
    }

    loadRecipes();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, isLoading }}>
      {children}
    </RecipeContext.Provider>
  );
}

/**
 * useRecipes
 *
 * Hook to get the list of recipes from the context.
 * @returns recipes — the current list of recipes (summary only)
 */
export function useRecipes() {
  const { recipes } = useContext(RecipeContext);
  return recipes;
}

/**
 * useIsRecipesLoading
 *
 * Hook to get the loading state from the context.
 *  * @returns isLoading — whether the recipes are still loading
 */
export function useIsRecipesLoading() {
  const { isLoading } = useContext(RecipeContext);
  return isLoading;
}

/**
 * 🪄 useRecipe
 *
 * Hook to find a single recipe from the context by ID.
 * Only looks in the summary list — does NOT fetch full details.
 * @param recipeId - the ID of the recipe to find
 * @returns Recipe | undefined — the matching recipe, if found
 */
export function useRecipe(recipeId: string): Recipe | undefined {
  const recipes = useRecipes();
  return recipes.find((r) => String(r.id) === recipeId);
}
