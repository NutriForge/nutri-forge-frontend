import { Recipe, MealPlan } from "@/types/recipe";
import {  Droppable } from "@hello-pangea/dnd";
import DraggableRecipeCard from "./DraggableRecipeCard";

export default function MealSection({ title, droppableId, recipes, onDelete }: {
  title: string;
  droppableId: keyof MealPlan;
  recipes: Recipe[];
  onDelete: (mealType: keyof MealPlan, id: string) => void;
}) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[100px] rounded p-4 transition border ${
              snapshot.isDraggingOver ? "bg-green-50 border-green-300" : "border-dashed border-gray-300"
            }`}
          >
            {recipes.length === 0 && (
              <div className="text-sm text-gray-400">No recipes yet</div>
            )}
            {recipes.map((recipe, index) => (
              <DraggableRecipeCard
                recipe={recipe}
                index={index}
                key={recipe.id}
                mealType={droppableId}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}