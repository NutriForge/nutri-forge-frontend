import { useState, useEffect } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { addRecipeToMealPlan } from "@/util/mealPlan";
import { Recipe } from "@/types/recipe";

export default function AddRecipeModal({
  onClose,
  mealType,
}: {
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "dinner";
}) {
  const recipes = useRecipes();
  const [inputValue, setInputValue] = useState("");
  const [externalResults, setExternalResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    if (inputValue.length < 3 || filtered.length > 0) {
      setExternalResults([]);
      return;
    }

    setLoading(true);

    const controller = new AbortController();
    const delay = setTimeout(async () => {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        inputValue
      )}&search_simple=1&action=process&json=1&page_size=10`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        const filteredProducts = (data.products || []).filter(
          (p: any) =>
            !p.countries_tags?.includes("en:russia") &&
            p.product_name
        );

        setExternalResults(filteredProducts);
      } catch (e) {
        if (e.name !== "AbortError") console.error("❗Помилка запиту:", e);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => {
      controller.abort();
      clearTimeout(delay);
    };
  }, [inputValue]);

  const handleExternalClick = (product: Recipe) => {
    const newRecipe = {
      ...product
    };

    addRecipeToMealPlan(newRecipe, mealType);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-150 shadow-lg relative">
        <h4 className="text-lg font-semibold mb-2">Додати рецепт</h4>
        <input
          type="text"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          placeholder="Почніть вводити назву..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        />

        <ul className="border border-gray-200 rounded max-h-48 overflow-y-auto">
          {filtered.map((r) => (
            <li
              key={r.id}
              onClick={() => {
                addRecipeToMealPlan(r, mealType);
                onClose();
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {r.name}
            </li>
          ))}

          {loading && (
            <li className="px-3 py-4 text-center text-sm text-gray-400">
              <svg
                className="animate-spin h-5 w-5 mx-auto text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <div>Шукаємо продукти...</div>
            </li>
          )}

          {filtered.length === 0 &&
            !loading &&
            externalResults.map((p) => (
              <li
                key={p.code}
                onClick={() => handleExternalClick(p)}
                className="px-3 py-2 hover:bg-green-50 cursor-pointer flex gap-2 text-sm"
              >
                <img
                  src={p.image_small_url || "https://placehold.co/40"}
                  alt=""
                  className="w-6 h-6 object-cover rounded"
                />
                <span>{p.product_name}</span>
                <span className="ml-auto text-gray-400 text-xs">
                  {p.countries_tags?.join(", ")}
                </span>
              </li>
            ))}

          {filtered.length === 0 &&
            inputValue.length >= 3 &&
            !loading &&
            externalResults.length === 0 && (
              <li className="px-3 py-2 text-gray-400 italic">
                Нічого не знайдено
              </li>
            )}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Закрити
        </button>
      </div>
    </div>
  );
}
