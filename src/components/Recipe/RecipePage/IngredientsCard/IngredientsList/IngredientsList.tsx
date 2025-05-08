import { useRecipes } from "@/context/RecipeContext";
import { IngredientItem } from "./IngredientItem";

export function IngredientList({
  recipe_id,
  onChange,
  showMacros,
}: {
  recipe_id: string;
  onChange: (index: number, newWeight: number) => void;
  showMacros: boolean;
}) {
  const ingredients = useRecipes().find((r) => r.id === Number(recipe_id))?.ingredients;

  return (
    <ul className="space-y-2 text-sm text-gray-700">
      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
          ingredient={ingredient}
          index={index}
          onChange={onChange}
          showMacros={showMacros}
        />
      ))}
    </ul>
  );
}