import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

type Recipe = {
  id: string;
  name: string;
  kcal: number;
  proteins: number;
  fats: number;
  carbs: number;
  image: string;
};

type MealPlan = {
  breakfast: Recipe[];
  lunch: Recipe[];
  dinner: Recipe[];
};

const initialData: MealPlan = {
  breakfast: [],
  lunch: [],
  dinner: [],
};

export default function MealPlanner() {
  const [meals, setMeals] = useState<MealPlan>(initialData);

  useEffect(() => {
    const storedPlan = JSON.parse(localStorage.getItem("mealPlan") || "{}");
    if (Object.keys(storedPlan).length > 0) {
      setMeals((prev) => ({
        ...prev,
        ...storedPlan,
      }));
    }
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
  
    // ❗ якщо місце не змінилося — нічого не робимо
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  
    const sourceList = [...meals[source.droppableId as keyof MealPlan]];
    const [movedItem] = sourceList.splice(source.index, 1);
  
    const destList = [...meals[destination.droppableId as keyof MealPlan]];
    destList.splice(destination.index, 0, movedItem);
  
    const updatedMeals = {
      ...meals,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    };
  
    setMeals(updatedMeals);
    localStorage.setItem("mealPlan", JSON.stringify(updatedMeals));
  };

  const handleDeleteRecipe = (mealType: keyof MealPlan, id: string) => {
    const updatedList = meals[mealType].filter((r) => r.id !== id);
    const updatedMeals = {
      ...meals,
      [mealType]: updatedList,
    };

    setMeals(updatedMeals);
    localStorage.setItem("mealPlan", JSON.stringify(updatedMeals));
  };

  const summary = Object.values(meals).flat().reduce(
    (acc, recipe) => ({
      kcal: acc.kcal + recipe.kcal,
      proteins: acc.proteins + recipe.proteins,
      fats: acc.fats + recipe.fats,
      carbs: acc.carbs + recipe.carbs,
    }),
    { kcal: 0, proteins: 0, fats: 0, carbs: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Раціон</h1>
      <div className="flex">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 mr-8 grid grid-cols-1 gap-6">
            <MealSection title="🧃 Сніданок" droppableId="breakfast" recipes={meals.breakfast} onDelete={handleDeleteRecipe} />
            <MealSection title="🍛 Обід" droppableId="lunch" recipes={meals.lunch} onDelete={handleDeleteRecipe} />
            <MealSection title="🍲 Вечеря" droppableId="dinner" recipes={meals.dinner} onDelete={handleDeleteRecipe} />
          </div>
        </DragDropContext>

        <aside className="w-80 bg-white shadow-md rounded-lg p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>
          <div className="text-sm text-gray-700 space-y-2 mb-6">
            <div>🍽 Калорійність: <span className="font-medium">{summary.kcal.toFixed(2)} ккал</span></div>
            <div>🥚 Білки: <span className="font-medium">{summary.proteins.toFixed(2)} г</span></div>
            <div>🥑 Жири: <span className="font-medium">{summary.fats.toFixed(2)} г</span></div>
            <div>🍞 Вуглеводи: <span className="font-medium">{summary.carbs.toFixed(2)} г</span></div>
          </div>

          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition">
            Список продуктів
          </button>
        </aside>
      </div>
    </div>
  );
}

function MealSection({ title, droppableId, recipes, onDelete }: {
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

function DraggableRecipeCard({ recipe, index, mealType, onDelete }: {
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