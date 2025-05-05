export default function MealPlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Заголовок зверху */}
      <h1 className="text-3xl font-bold mb-8">Your Meal Plan</h1>

      {/* Основний контент: зони + сайдбар */}
      <div className="flex">
        {/* Meal zones */}
        <div className="flex-1 mr-8">
          <div className="grid grid-cols-1 gap-6">
            <MealSection title="🥣 Breakfast" />
            <MealSection title="🍛 Lunch" />
            <MealSection title="🍲 Dinner" />
          </div>
        </div>

        {/* Sidebar */}
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
    </div>
  );
}

function MealSection({ title }: { title: string }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <div className="min-h-[100px] border border-dashed border-gray-300 rounded p-4 text-gray-400 text-sm">
        No recipes yet. Drag or add items here.
      </div>
    </div>
  );
}
