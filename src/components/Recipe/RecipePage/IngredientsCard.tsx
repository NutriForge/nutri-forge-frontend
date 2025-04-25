import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecipes } from "../../../context/RecipeContext";
import { LockToggleButton } from "./LockToggleButton";

export default function IngredientsCard() {
  const { id } = useParams();
  const recipes = useRecipes();
  const recipe = recipes.find((r) => r.id === Number(id));

  //To draw ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  //This is for calculation proportion
  const [originalIngredients, setOriginalIngredients] = useState<Ingredient[]>(
    []
  );

  //This is to preserved weight
  const [desiredTotalWeight, setDesiredTotalWeight] = useState<string>("");

  useEffect(() => {
    if (recipe) {
      setIngredients(recipe.ingredients);
      setOriginalIngredients(recipe.ingredients);
      const total = recipe.ingredients.reduce(
        (sum, ing) => sum + ing.weight_in_g,
        0
      );
      setDesiredTotalWeight(String(total));
    }
  }, [recipe]);

  const handleChange = (index: number, newWeight: number) => {
    const updated = [...ingredients];
    updated[index].weight_in_g = newWeight;
  
    const total = updated.reduce(
      (sum, ing) => sum + ing.weight_in_g,
      0
    );
  
    setIngredients(updated);
    setDesiredTotalWeight(String(total)); // <-- тут виправлено
  };

  const recalculateByTotalWeight = (newTotalWeight: number) => {
    const originalTotal = originalIngredients.reduce(
      (sum, ing) => sum + ing.weight_in_g,
      0
    );

    const ratio = newTotalWeight / originalTotal;

    const updated = originalIngredients.map((ing) => ({
      ...ing,
      weight_in_g: Math.round(ing.weight_in_g * ratio),
    }));

    setIngredients(updated);
  };

  function handleLockStateChange(isLocked) {
    console.log("State: " + isLocked);
  }

  return (
    <div className="w-full max-w-md border-black mx-auto rounded-xl border overflow-hidden">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
        <div className="flex-1 text-center">
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
              <span className="w-1/2">{ingredient.name}</span>
              <div>
                <input
                  type="number"
                  value={ingredient.weight_in_g}
                  onChange={(e) => handleChange(index, Number(e.target.value))}
                  className="w-15 border rounded px-1 py-0.5 justify-end"
                />
                <span className="ml-2">г</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 mb-2 justify-end mt-3">
          <label className="text-s font-medium">Загальна вага:</label>
          <input
            type="number"
            className="w-15 border rounded px-1 justify-end"
            value={desiredTotalWeight}
            onChange={(e) => setDesiredTotalWeight(e.target.value)}
            onBlur={() => {
              const parsed = Number(desiredTotalWeight);
              if (!isNaN(parsed)) recalculateByTotalWeight(parsed);
            }}
          />
          <span className="text-sm text-gray-500">г</span>
        </div>
      </div>
    </div>
  );
}
