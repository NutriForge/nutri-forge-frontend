import { ProductMacros } from "./ProductMacros";

export function IngredientItem({
  ingredient,
  index,
  onChange,
  showMacros,
}: {
  ingredient: any;
  index: number;
  onChange: (index: number, newWeight: number) => void;
  showMacros: boolean;
}) {
  return (
    <li className="flex flex-col border-b pb-2 gap-1">
      <div className="flex justify-between items-center gap-2">
        <span className="w-1/3">{ingredient.name}</span>
        {showMacros && (
        <ProductMacros
          weight={ingredient.weight_in_g}
          protein={ingredient.protein_per_100g}
          fat={ingredient.fat_per_100g}
          carbs={ingredient.carbs_per_100g}
          kcal={ingredient.kcal_per_100g}
        />
      )}
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={ingredient.weight_in_g}
            onChange={(e) => onChange(index, Number(e.target.value))}
            className="w-15 border rounded px-1 py-0.5 text-right"
          />
          <span className="ml-2">г</span>
        </div>
      </div>
    </li>
  );
}