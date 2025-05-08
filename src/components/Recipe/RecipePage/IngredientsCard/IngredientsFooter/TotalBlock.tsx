import { useState } from "react";
import { ChevronToggle } from "./ChevronToggle";
import { TotalWeightInput } from "./TotalWeightInput";
import { TotalMacros } from "./TotalMacros";
import { useRecipes } from "@/context/RecipeContext";

interface TotalMacrosProps {
  isOpen: boolean;
  totalMacros: {
    proteins: number;
    carbs: number;
    fats: number;
    kcal: number;
  };
}

export function TotalBlock({
  recipe_id,
  setTotalWeight,
  handleTotalWeight
}: {
  recipe_id: string;
  totalMacros: TotalMacrosProps;
  setTotalWeight: (val: string) => void;
  handleTotalWeight: (val: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const recipe = useRecipes().find((r) => r.id === Number(recipe_id));
  return (
    <div>
      <div className="flex gap-2 items-center justify-end mt-3">
        <ChevronToggle isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
        <TotalWeightInput
          totalWeight={recipe.weight_per_portion | 0}
          setTotalWeight={setTotalWeight}
          handleTotalWeight={handleTotalWeight}
        />
      </div>
      <TotalMacros
  isOpen={isOpen}
  totalMacros={{
    proteins: recipe?.total_proteins ?? 0,
    carbs: recipe?.total_carbs ?? 0,
    fats: recipe?.total_fats ?? 0,
    kcal: recipe?.total_kcal ?? 0,
  }}
/>
    </div>
  );
}