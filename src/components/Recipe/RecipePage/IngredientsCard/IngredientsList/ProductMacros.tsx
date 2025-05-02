export function ProductMacros({
  proteins,
  fats,
  carbs,
  kcal,
  weight,
}: {
  proteins?: number;
  fats?: number;
  carbs?: number;
  kcal?: number;
  weight: number;
}) {

  return (
    <div className="grid grid-cols-4 text-xs text-gray-500">
      <span>Б: {((proteins || 0)).toFixed(1)}</span>
      <span>Ж: {((fats || 0)).toFixed(1)}</span>
      <span>В: {((carbs || 0)).toFixed(1)}</span>
      <span>Ккал: {((kcal || 0)).toFixed(1)}</span>
    </div>
  );
}