import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAllRecipes, getAllIngredients } from '../services/recipeService';
import { Recipe, IngredientInfo } from '../types/recipe';
import { enrichRecipesWithMacros } from '@/util/recipeCalculations';

const RecipeContext = createContext<Recipe[] | undefined>(undefined);

interface RecipeProviderProps {
  children: ReactNode;
}

export function RecipeProvider({ children }: RecipeProviderProps) {

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function loadData() {
      const rawRecipes = await getAllRecipes();
      const ingredients = await getAllIngredients();
      console.log(rawRecipes);
  
      //Add macros to the recipe
      const enriched = enrichRecipesWithMacros(rawRecipes, ingredients);

      //Calculate total weight per portion
      const updated = enriched.map((recipe) => {
        const totals = recipe.ingredients.reduce(
          (acc, ing) => ({
            weight: acc.weight + ing.weight_in_g,
            proteins: acc.proteins + (ing.proteins || 0),
            fats: acc.fats + (ing.fats || 0),
            carbs: acc.carbs + (ing.carbs || 0),
            kcal: acc.kcal + (ing.kcal || 0),
          }),
          { weight: 0, proteins: 0, fats: 0, carbs: 0, kcal: 0 }
        );
      
        return {
          ...recipe,
          weight_per_portion: totals.weight,
          total_proteins: +totals.proteins.toFixed(2),
          total_fats: +totals.fats.toFixed(2),
          total_carbs: +totals.carbs.toFixed(2),
          total_kcal: +totals.kcal.toFixed(2),
        };
      });

      setRecipes(updated);
    }
  
    loadData();
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
