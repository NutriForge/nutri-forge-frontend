import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAllRecipes } from '../services/recipeService';

// Тип для одного інгредієнта
export interface Ingredient {
  name: string;
  number: number;
  weight_in_g: number;
}

// Тип для одного рецепту
export interface Recipe {
  id: number;
  name: string;
  type: string;
  weight_per_portion: number;
  rating: number;
  ingredients: Ingredient[];
  description: string;
}

// Контекст очікує масив рецептів
const RecipeContext = createContext<Recipe[] | undefined>(undefined);

// Тип пропсів для провайдера
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
