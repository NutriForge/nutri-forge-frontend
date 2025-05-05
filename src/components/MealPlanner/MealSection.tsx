export default function MealSection({ title }: { title: string }) {
  // Тимчасовий список рецептів — згодом це буде приходити з props або стейту
  const recipes = [
    {
      id: 1,
      name: "Berry Oatmeal",
      kcal: 350,
      proteins: 12,
      fats: 6,
      carbs: 45,
      image: "https://placehold.co/80?text=Berry Oatmeal"
    },
    {
      id: 2,
      name: "Cottage Cheese with Fruit",
      kcal: 250,
      proteins: 18,
      fats: 5,
      carbs: 20,
      image: "https://placehold.co/80?text=Cottage Cheese"
    }
  ];

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <h3 className="text-xl font-medium mb-4">{title}</h3>

      <div className="space-y-3">
        {recipes.map(recipe => (
          <div
            key={recipe.id}
            className="flex items-center border border-gray-200 rounded-md p-3 hover:shadow-sm transition"
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
        ))}
      </div>
    </div>
  );
}