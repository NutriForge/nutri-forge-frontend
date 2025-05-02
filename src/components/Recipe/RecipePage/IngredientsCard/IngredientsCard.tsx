import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecipes } from "../../../../context/RecipeContext";
import { TotalBlock } from "./IngredientsFooter/TotalBlock";
import { IngredientList } from "./IngredientsList/IngredientsList";
import { IngredientsHeader } from "./IngredientsHeader/IngredientsHeader";
import { calculateTotalWeight, scaleIngredients } from "@/util/recipeCalculations";

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
    if (recipe) {
      setIngredients(recipe.ingredients);
      const total = calculateTotalWeight(recipe.ingredients);
      setTotalWeight(String(total));
    }
  }, [recipe]);

  function handleLockStateChange(isLocked) {
    console.log("State: " + isLocked);
    setIsLocked(isLocked);
  }

  function handleRowClick() {
    setIsMacrosOpen((prev) => !prev);
  }

  function handleIngredientChange(index: number, newWeight: number) {
    let updated = [...ingredients];

    const originalIngredients = recipe.ingredients;
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
    const originalTotal = calculateTotalWeight(recipe.ingredients);

    const updated = scaleIngredients(recipe.ingredients, originalTotal, newTotalWeight);

    setIngredients(updated);
  }

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <IngredientsHeader
        onTitleClick={handleRowClick}
        onChangeLock={handleLockStateChange}
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
