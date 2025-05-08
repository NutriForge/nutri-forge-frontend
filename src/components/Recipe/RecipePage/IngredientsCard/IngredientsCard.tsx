import { useState } from "react";
import { useParams } from "react-router-dom";
import { TotalBlock } from "./IngredientsFooter/TotalBlock";
import { IngredientList } from "./IngredientsList/IngredientsList";
import { IngredientsHeader } from "./IngredientsHeader/IngredientsHeader";
import { calculateTotalMacros, calculateTotalWeight, scaleIngredients } from "@/util/recipeCalculations";

export default function IngredientsCard() {
  const { id } = useParams();

  //To change ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  //To change total weight
  const [totalWeight, setTotalWeight] = useState<string>("");

  const [totalMacros, setTotalMacros] = useState<TotalMacrosProps>({
    proteins: 0,
    carbs: 0,
    fats: 0,
    kcal: 0
  });

  const [isLocked, setIsLocked] = useState(true);

  const [isMacrosOpen, setIsMacrosOpen] = useState(false);

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
    const totalMacros = calculateTotalMacros(updated);
    setTotalWeight(String(total));
    setTotalMacros(totalMacros);
    setIngredients(updated);
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
          recipe_id={id}
          onChange={handleIngredientChange}
          showMacros={isMacrosOpen}
        />
        <TotalBlock
          recipe_id={id}
          totalMacros={totalMacros}
          setTotalWeight={setTotalWeight}
          handleTotalWeight={handleTotalWeight}
        />
      </div>
    </div>
  );
}
