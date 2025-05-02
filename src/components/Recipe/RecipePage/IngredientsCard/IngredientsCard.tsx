import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecipes } from "../../../../context/RecipeContext";
import { TotalBlock } from "./IngredientsFooter/TotalBlock";
import { IngredientList } from "./IngredientsList/IngredientsList";
import { IngredientsHeader } from "./IngredientsHeader/IngredientsHeader";
import { calculateTotalWeight, scaleIngredients } from "@/util/recipeCalculations";
import {getAllIngredients} from "../../../../services/recipeService.js"

export default function IngredientsCard() {
  const { id } = useParams();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));

  //To change ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  //To change total weight
  const [totalWeight, setTotalWeight] = useState<string>("");

  const [isLocked, setIsLocked] = useState(true);

  const [isMacrosOpen, setIsMacrosOpen] = useState(false);

  useEffect(() => {
    async function enrichIngredients() {
      if (!recipe) return;
  
      try {
        const ingredientsInfo = await getAllIngredients();

        const enriched = recipe.ingredients.map((ing) => {
          console.log("ingredientsInfo", ingredientsInfo);
          console.log("looking for:", ing.name);
          const info = ingredientsInfo.find((i) => {
            if (!i.name) return false;
          
            // якщо name — масив синонімів
            if (Array.isArray(i.name)) {
              return i.name.some((syn) =>
                syn.toLowerCase() === ing.name.toLowerCase()
              );
            }
          
            // fallback: якщо name — звичайний рядок
            return i.name.toLowerCase() === ing.name.toLowerCase();
          });
  
          if (!info) return ing;
  
          const factor = ing.weight_in_g / 100;
  
          return {
            ...ing,
            proteins: +(info.proteins * factor).toFixed(2),
            carbs: +(info.carbs * factor).toFixed(2),
            fats: +(info.fats * factor).toFixed(2),
            kcal: +(info.kcal * factor).toFixed(2),
          };
        });
  
        setIngredients(enriched);
        const total = calculateTotalWeight(ingredients);
        setTotalWeight(String(total));
      } catch (error) {
        console.error("Failed to load ingredient info:", error);
      }
    }
  
    enrichIngredients();
  }, [recipe]);

  function handleRowClick() {
    setIsMacrosOpen((prev) => !prev);
  }

  function handleIngredientChange(index: number, newWeight: number) {
    let updated = [...ingredients];

    const originalIngredients = ingredients;
    const originalWeight = originalIngredients[index].weight_in_g;
  
    if (isLocked) {
      updated = scaleIngredients(originalIngredients, originalWeight, newWeight);
    } else {
      updated[index] = { ...updated[index], weight_in_g: newWeight };
    }
  
    const total = calculateTotalWeight(updated);
  
    setIngredients(updated);
    setTotalWeight(String(total));
  }

  function handleTotalWeight(newTotalWeight: number) {
    const originalTotal = calculateTotalWeight(ingredients);

    const updated = scaleIngredients(ingredients, originalTotal, newTotalWeight);

    setIngredients(updated);
  }

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <IngredientsHeader
        onTitleClick={handleRowClick}
        onChangeLock={setIsLocked}
      />

      <div className="p-4">
        <IngredientList
          ingredients={ingredients}
          onChange={handleIngredientChange}
          showMacros={isMacrosOpen}
        />
        <TotalBlock
          totalWeight={totalWeight}
          setTotalWeight={setTotalWeight}
          handleTotalWeight={handleTotalWeight}
        />
      </div>
    </div>
  );
}
