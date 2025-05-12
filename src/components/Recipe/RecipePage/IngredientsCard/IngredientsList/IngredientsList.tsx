import { useIngredientsForm } from "@/context/IngredientsFormContext";
import { IngredientItem } from "./IngredientItem";

export function IngredientList({
  onChange,
  showMacros,
}: {
  onChange: (index: number, newWeight: number) => void;
  showMacros: boolean;
}) {
  const { state } = useIngredientsForm();
  const { ingredients } = state;

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
