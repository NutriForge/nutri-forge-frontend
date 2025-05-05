import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

const initialData = {
  breakfast: [
    {
      id: "1",
      name: "Berry Oatmeal",
      kcal: 350,
      proteins: 12,
      fats: 6,
      carbs: 45,
      image: "https://placehold.co/80?text=Berry Oatmeal"
    }
  ],
  lunch: [],
  dinner: []
};

export default function MealPlanner() {
  const [meals, setMeals] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = [...meals[source.droppableId as keyof typeof meals]];
    const [movedItem] = sourceList.splice(source.index, 1);

    const destList = [...meals[destination.droppableId as keyof typeof meals]];
    destList.splice(destination.index, 0, movedItem);

    setMeals({
      ...meals,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Your Meal Plan</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex">
          <div className="flex-1 mr-8 grid grid-cols-1 gap-6">
            <MealSection title="🥣 Breakfast" droppableId="breakfast" recipes={meals.breakfast} />
            <MealSection title="🍛 Lunch" droppableId="lunch" recipes={meals.lunch} />
            <MealSection title="🍲 Dinner" droppableId="dinner" recipes={meals.dinner} />
          </div>

          <aside className="w-80 bg-white shadow-md rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Summary</h2>
            <div className="text-sm text-gray-700 space-y-2 mb-6">
              <div>🍽 Calories: <span className="font-medium">1750 kcal</span></div>
              <div>🥚 Protein: <span className="font-medium">110 g</span></div>
              <div>🥑 Fat: <span className="font-medium">65 g</span></div>
              <div>🍞 Carbs: <span className="font-medium">180 g</span></div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition">
              Print Meal Plan
            </button>
          </aside>
        </div>
      </DragDropContext>
    </div>
  );
}

function MealSection({ title, droppableId, recipes }: {
  title: string;
  droppableId: string;
  recipes: any[];
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
              <DraggableRecipeCard recipe={recipe} index={index} key={recipe.id} />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

function DraggableRecipeCard({ recipe, index }: { recipe: any; index: number }) {
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
              {recipe.kcal} kcal • Б: {recipe.proteins}г • Ж: {recipe.fats}г • В: {recipe.carbs}г
            </div>
          </div>
          <button className="text-gray-400 hover:text-red-500 text-sm">✕</button>
        </div>
      )}
    </Draggable>
  );
}
