import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { MealPlan } from "@/types/recipe";
import MealSection from "./MealSection";

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

  // Calls when drag has done
  const onDragEnd = (result: DropResult) => {

    //If user doesn't drag into destination area - do nothing
    const { source, destination } = result;
    if (!destination) return;
  
    //If user drag the item into the same area - do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
  
    // Copy source list and cut draggable element from it
    const sourceList = [...meals[source.droppableId as keyof MealPlan]];
    const [movedItem] = sourceList.splice(source.index, 1);
  
    // Add draggable element into desired list
    const destList = [...meals[destination.droppableId as keyof MealPlan]];
    destList.splice(destination.index, 0, movedItem);
  
    // Update elements in our mealPlan State
    const updatedMeals = {
      ...meals,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    };
  
    setMeals(updatedMeals);

    // Write the new information into local storage
    localStorage.setItem("mealPlan", JSON.stringify(updatedMeals));
  };

  // Function to remove recipe
  const handleDeleteRecipe = (mealType: keyof MealPlan, id: number) => {
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