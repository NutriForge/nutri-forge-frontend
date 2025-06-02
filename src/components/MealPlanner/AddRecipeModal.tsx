import { useState, useEffect } from "react";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe, OpenFoodIngredient } from "@/types/recipe";

export default function AddRecipeModal({
  onClose,
  mealType,
  onAddRecipe,
}: {
  onClose: () => void;
  mealType: "breakfast" | "lunch" | "dinner";
  onAddRecipe: (mealType: keyof MealPlan, recipe: Recipe) => void;
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
          (p: any) => !p.countries_tags?.includes("en:russia") && p.product_name
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


  const handleExternalClick = (product: OpenFoodIngredient) => {
    console.log(product);
    const newRecipe = {
      id: product.id as number,
      name: product.product_name,
      img: product.image_front_url,
      weight_per_portion: 100,
      total_proteins: product.nutriments["proteins"] as number,
      total_fats: product.nutriments["fat"] as number,
      total_carbs: product.nutriments["carbohydrates"] as number,
      total_kcal: product.nutriments["energy-kcal"] as number,
    };

    onAddRecipe(mealType, newRecipe);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="w-[600px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h2
            id="modalTitle"
            className="text-xl font-bold text-gray-900 sm:text-2xl"
          >
            Додати рецепт
          </h2>

          <button
            type="button"
            className="-me-4 -mt-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4">
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
                  onAddRecipe(mealType, r);
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
        </div>

        <footer className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Відміна
          </button>

          <button
            type="button"
            className="rounded bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Пошук
          </button>
        </footer>
      </div>
    </div>
  );
}
