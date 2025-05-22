import { Recipe, MealPlan } from "@/types/recipe";
import {  Draggable } from "@hello-pangea/dnd";

export default function DraggableRecipeCard({ recipe, index, mealType, onDelete }: {
  recipe: Recipe;
  index: number;
  mealType: keyof MealPlan;
  onDelete: (mealType: keyof MealPlan, id: string) => void;
}) {
  return (
    <Draggable draggableId={recipe.id} index={index}>
      {(provided) => (
        <div
          className="flex items-center bg-white border border-gray-200 rounded-md p-3 mb-3 shadow-sm"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-16 h-16 object-cover rounded mr-4"
          />
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-800">{recipe.name}</div>
            <div className="text-xs text-gray-500">
              {recipe.kcal.toFixed(1)} ккал • Б: {recipe.proteins.toFixed(1)}г • Ж: {recipe.fats.toFixed(1)}г • В: {recipe.carbs.toFixed(1)}г
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-red-500 text-sm"
            onClick={() => onDelete(mealType, recipe.id)}
          >
            ✕
          </button>
        </div>
      )}
    </Draggable>
  );
}