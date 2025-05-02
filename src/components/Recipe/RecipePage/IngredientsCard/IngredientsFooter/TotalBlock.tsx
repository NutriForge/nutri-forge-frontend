import { useState } from "react";
import { ChevronToggle } from "./ChevronToggle";
import { TotalWeightInput } from "./TotalWeightInput";
import { TotalMacros } from "./TotalMacros";

export function TotalBlock({
  totalWeight,
  setTotalWeight,
  handleTotalWeight
}: {
  totalWeight: string;
  setTotalWeight: (val: string) => void;
  handleTotalWeight: (val: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex gap-2 items-center justify-end mt-3">
        <ChevronToggle isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
        <TotalWeightInput
          totalWeight={totalWeight}
          setTotalWeight={setTotalWeight}
          handleTotalWeight={handleTotalWeight}
        />
      </div>
      <TotalMacros isOpen={isOpen} />
    </div>
  );
}