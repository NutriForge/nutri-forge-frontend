export function ProductMacros({
  protein,
  fat,
  carbs,
  kcal,
  weight,
}: {
  protein?: number;
  fat?: number;
  carbs?: number;
  kcal?: number;
  weight: number;
}) {
  const ratio = weight / 100;

  return (
    <div className="grid grid-cols-4 text-xs text-gray-500">
      <span>Б: {(protein || 0) * ratio}</span>
      <span>Ж: {(fat || 0) * ratio}</span>
      <span>В: {(carbs || 0) * ratio}</span>
      <span>Ккал: {(kcal || 0) * ratio}</span>
    </div>
  );
}