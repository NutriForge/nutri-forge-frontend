import { useState } from "react";
import { ChevronToggle } from "./ChevronToggle";
import { TotalWeightInput } from "./TotalWeightInput";
import { TotalMacros } from "./TotalMacros";
import { useIngredientsForm } from "@/context/IngredientsFormContext";

export function TotalBlock({
  handleTotalWeight,
}: {
  handleTotalWeight: (val: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useIngredientsForm();
  const { totalWeight } = state;

  return (
    <div>
      <div className="flex gap-2 items-center justify-end mt-3">
        <ChevronToggle isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
        <TotalWeightInput
          totalWeight={Number(totalWeight.toFixed(0))}
          setTotalWeight={(val) => dispatch({ type: 'UPDATE_TOTAL_WEIGHT', payload: val })}
          handleTotalWeight={handleTotalWeight}
        />
      </div>
      <TotalMacros isOpen={isOpen} />
    </div>
  );
}
