import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecipes } from "../../../../context/RecipeContext";
import { LockToggleButton } from "./LockToggleButton";
import ProductMacros from "./ProductMacros";
import { TotalWeightInput } from "./TotalWeightInput";
import { TotalMacros } from "./TotalMacros";
import { TotalBlock } from "./TotalBlock";

export default function IngredientsCard() {
  const { id } = useParams();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));

  //To change ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  //To change total weight
  const [totalWeight, setTotalWeight] = useState<string>("");

  const [isLocked, setIsLocked] = useState(true);

  const [isMacrosHidden, setIsMacrosHidden] = useState(true);

  const [isTotalMacrosHidden, setIsTotalMacrosHidden] = useState(true);

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
    setIsMacrosHidden((prev) => !prev);
  }

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
        <div className="flex-1 text-center" onClick={handleRowClick}>
          <h2 className="font-semibold text-black">Інгридієнти</h2>
        </div>
        <LockToggleButton onChangeLock={handleLockStateChange} />
      </div>

      <div className="p-4">
        <ul className="space-y-2 text-sm text-gray-700">
          {ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-1 gap-2"
            >
              <span className="w-1/3">{ingredient.name}</span>
              {isMacrosHidden && <ProductMacros />}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={ingredient.weight_in_g}
                  onChange={(e) =>
                    handleIngredientChange(index, Number(e.target.value))
                  }
                  className="w-15 border rounded px-1 py-0.5 justify-end"
                />
                <span className="ml-2">г</span>
              </div>
            </li>
          ))}
        </ul>
        <TotalBlock
          totalWeight={totalWeight}
          setTotalWeight={setTotalWeight}
          handleTotalWeight={handleTotalWeight}
        />
      </div>
    </div>
  );
}
