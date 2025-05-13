type Macros = {
  proteins: number;
  fats: number;
  carbs: number;
  kcal: number;
};

export function TotalMacros({
  isOpen,
  totalMacros,
}:{
  isOpen: boolean;
  totalMacros: Macros;
}) {
  return (
    <div
      className={`overflow-hidden transition-all duration-500 ${
        isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
      } text-sm text-gray-700`}
    >
      <div className="text-right">
        <div>Білки: {(totalMacros.proteins).toFixed(2)} г</div>
        <div>Жири: {(totalMacros.fats).toFixed(2)} г</div>
        <div>Вуглеводи: {(totalMacros.carbs).toFixed(2)} г</div>
        <div>Калорії: {(totalMacros.kcal).toFixed(2)} ккал</div>
      </div>
    </div>
  );
}