import { Recipe, MealPlan } from "@/types/recipe";
import {  Droppable } from "@hello-pangea/dnd";
import DraggableRecipeCard from "./DraggableRecipeCard";
import { useState } from "react";
import AddRecipeModal from "./AddRecipeModal";

export default function MealSection({ title, droppableId, recipes, onDelete }: {
  title: string;
  droppableId: keyof MealPlan;
  recipes: Recipe[];
  onDelete: (mealType: keyof MealPlan, id: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");


  const handleSubmit = () => {
    console.log("User input:", inputValue); // тут можна зробити fetch, пошук або додавання
    setInputValue("");
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">{title}</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-500 hover:text-teal-600 text-2xl leading-none"
          aria-label="Add recipe"
        >
          +
        </button>
      </div>

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

      {isModalOpen && (
  <AddRecipeModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    mealType={droppableId}
  />
)}
    </div>
  );
}