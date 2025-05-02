import { LockToggleButton } from "./LockToggleButton";

export function IngredientsHeader({
  onTitleClick,
  onChangeLock,
}: {
  onTitleClick: () => void;
  onChangeLock: (locked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
      <div className="flex-1 text-center" onClick={onTitleClick}>
        <h2 className="font-semibold text-black cursor-pointer">Інгридієнти</h2>
      </div>
      <LockToggleButton onChangeLock={onChangeLock} />
    </div>
  );
}