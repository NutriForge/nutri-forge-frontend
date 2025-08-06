import { Recipe, MealPlan } from "@/types/recipe";
import { Droppable } from "@hello-pangea/dnd";
import DraggableRecipeCard from "./DraggableRecipeCard";
import { useState } from "react";
import AddRecipeModal from "./AddRecipeModal";
import RecipeModal from "./RecipeModal";

export default function MealSection({
  title,
  droppableId,
  recipes,
  onDelete,
  onUpdateRecipe,
}: {
  title: string;
  droppableId: keyof MealPlan;
  recipes: Recipe[];
  onDelete: (mealType: keyof MealPlan, id: string) => void;
  onUpdateRecipe: (mealType: keyof MealPlan, recipe: Recipe) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>({
    id: "",
    name: "dummy recipe",
    img: "",
    ingredients: [],
    steps: [],
    weight_per_portion: 0,
    total_proteins: 0,
    total_fats: 0,
    total_carbs: 0,
    total_kcal: 0,
  });

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
              snapshot.isDraggingOver
                ? "bg-green-50 border-green-300"
                : "border-dashed border-gray-300"
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
                onClick={() => {
                  setSelectedRecipe(recipe);
                  setIsRecipeModalOpen(true);
                }}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isModalOpen && (
        <AddRecipeModal
          onClose={() => setIsModalOpen(false)}
          mealType={droppableId}
          onAddRecipe={onUpdateRecipe}
        />
      )}
      {isRecipeModalOpen &&
        <RecipeModal
          recipe={selectedRecipe}
          mealType={droppableId}
          onClose={() => {
            setIsRecipeModalOpen(false);
            setSelectedRecipe(selectedRecipe);
          }}
          onSaveRecipe={onUpdateRecipe}
        />
      }
    </div>
  );
}
