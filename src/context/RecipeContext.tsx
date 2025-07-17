import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAllRecipes } from '@/services/recipeService';
import { Recipe } from '@/types/recipe';

interface RecipeContextType {
  recipes: Recipe[];
  isLoading: boolean;
}

const defaultValue: RecipeContextType = {
  recipes: [],
  isLoading: true,
};

const RecipeContext = createContext<RecipeContextType>(defaultValue);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const recipes = await getAllRecipes();
      console.log(recipes);
      setRecipes(recipes);
      setIsLoading(false);
    }

    load();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, isLoading }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  return useContext(RecipeContext).recipes;
}

export function useRecipe(recipeId: number): Recipe {
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === recipeId);
  if (!recipe) throw new Error(`Recipe with id ${recipeId} not found`);
  return recipe;
}
