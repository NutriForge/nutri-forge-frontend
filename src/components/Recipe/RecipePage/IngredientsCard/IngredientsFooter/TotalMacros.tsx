export function TotalMacros({
  isOpen,
}: {
  isOpen: boolean;
}) {
  return (
    <div
      className={`overflow-hidden transition-all duration-500 ${
        isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
      } text-sm text-gray-700`}
    >
      <div className="text-right">
        <div>Білки: 10 г</div>
        <div>Жири: 10 г</div>
        <div>Вуглеводи: 10 г</div>
        <div>Калорії: 10 ккал</div>
      </div>
    </div>
  );
}