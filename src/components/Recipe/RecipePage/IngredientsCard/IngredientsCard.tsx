import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecipes } from "../../../../context/RecipeContext";
import { LockToggleButton } from "./LockToggleButton";

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
              onClick={handleRowClick}
            >
              <span className="w-1/3">{ingredient.name}</span>
              {isMacrosHidden && (
                <div className="grid grid-cols-4 text-xs text-gray-500 pl-2 mt-1">
                  <span> Б: 10 г</span>
                  <span> Ж: 10 г </span>
                  <span> В: 10 г </span>
                  <span> Ккал: 100 </span>
                </div>
              )}
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

        <div className="flex gap-2 mb-2 justify-end mt-3">
          <button
            onClick={() => setIsTotalMacrosHidden((prev) => !prev)}
            className="text-sm text-gray-600 hover:underline"
          >
            {isTotalMacrosHidden ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 transform rotate-180 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
          <label className="text-s font-medium">Загальна вага:</label>
          <input
            type="number"
            className="w-15 border rounded px-1 justify-end"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
            onBlur={() => {
              const parsed = Number(totalWeight);
              if (!isNaN(parsed)) handleTotalWeight(parsed);
            }}
          />
          <span className="text-sm text-gray-500">г</span>
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isTotalMacrosHidden
              ? "max-h-40 opacity-100 mt-2"
              : "max-h-0 opacity-0"
          } text-sm text-gray-700`}
        >
          <div className="text-right">
            <div>Білки: 10 г</div>
            <div>Жири: 10 г</div>
            <div>Вуглеводи: 10 г</div>
            <div>Калорії: 10 ккал</div>
          </div>
        </div>
      </div>
    </div>
  );
}
