import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecipes } from "../../../../context/RecipeContext";
import { TotalBlock } from "./IngredientsFooter/TotalBlock";
import { IngredientList } from "./IngredientsList";
import { IngredientsHeader } from "./IngredientsHeader";

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
      const total = recipe.ingredients.reduce(
        (sum, ing) => sum + ing.weight_in_g,
        0
      );
      setTotalWeight(String(total));
    }
  }, [recipe]);

  function handleIngredientChange(index: number, newWeight: number) {
    let updated = [...ingredients];

    const originalIngredients = recipe.ingredients;
    const originalWeight = originalIngredients[index].weight_in_g;

    if (isLocked) {
      const ratio = newWeight / originalWeight;

      updated = originalIngredients.map((ing) => ({
        ...ing,
        weight_in_g: Math.round(ing.weight_in_g * ratio),
      }));
    } else {
      updated[index].weight_in_g = newWeight;
    }

    const total = updated.reduce((sum, ing) => sum + ing.weight_in_g, 0);

    setIngredients(updated);
    setTotalWeight(String(total));
  }

  function handleTotalWeight(newTotalWeight: number) {
    const originalTotal = recipe.ingredients.reduce(
      (sum, ing) => sum + ing.weight_in_g,
      0
    );

    const ratio = newTotalWeight / originalTotal;

    const updated = recipe.ingredients.map((ing) => ({
      ...ing,
      weight_in_g: Math.round(ing.weight_in_g * ratio),
    }));

    setIngredients(updated);
  }

  function handleLockStateChange(isLocked) {
    console.log("State: " + isLocked);
    setIsLocked(isLocked);
  }

  function handleRowClick() {
    setIsMacrosOpen((prev) => !prev);
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
