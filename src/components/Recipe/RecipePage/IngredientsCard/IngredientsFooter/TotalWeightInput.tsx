export function TotalWeightInput({
  totalWeight,
  setTotalWeight,
  handleTotalWeight,
}: {
  totalWeight: number;
  setTotalWeight: (val: string) => void;
  handleTotalWeight: (val: number) => void;
}) {
  return (
    <>
      <label className="text-s font-medium">Загальна вага:</label>
      <input
        type="number"
        className="w-15 border rounded px-1 justify-end"
        value={totalWeight}
        onChange={(e) => setTotalWeight(e.target.value)}
        onBlur={() => {
          const parsed = totalWeight;
          if (!isNaN(parsed)) handleTotalWeight(parsed);
        }}
      />
      <span className="text-sm text-gray-500">г</span>
    </>
  );
}