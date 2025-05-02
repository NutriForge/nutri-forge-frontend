import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAllRecipes } from '../services/recipeService';
import { Recipe } from '../types/recipe';

const RecipeContext = createContext<Recipe[] | undefined>(undefined);

interface RecipeProviderProps {
  children: ReactNode;
}

export function RecipeProvider({ children }: RecipeProviderProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    getAllRecipes().then(setRecipes);
  }, []);

  return (
    <RecipeContext.Provider value={recipes}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes(): Recipe[] {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
