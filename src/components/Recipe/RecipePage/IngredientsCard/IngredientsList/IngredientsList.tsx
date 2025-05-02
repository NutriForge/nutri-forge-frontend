import { IngredientItem } from "./IngredientItem";

export function IngredientList({
  ingredients,
  onChange,
  showMacros,
}: {
  ingredients: any[];
  onChange: (index: number, newWeight: number) => void;
  showMacros: boolean;
}) {
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