import { useRecipe } from "@/context/RecipeContext";
import StarRating from "./StarRating";

export default function RecipeCard({recipe_id}) {
  const recipe = useRecipe(Number(recipe_id));
  return (
    <div className="overflow-hidden rounded-lg transition ">
      <img
        alt=""
        src={recipe?.img || "https://placehold.co/400?text=Фотосесія+рецепту+триває"}
        className="h-56 w-full object-cover"
      />

      <div className="bg-white p-4 sm:p-6">
        <StarRating rating={recipe?.rating || 0} />
        <h3 className="mt-0.5 text-lg text-gray-900">{recipe?.name || ""}</h3>
        

        <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">Порція {recipe?.weight_per_portion || 0} г</p>
        <div className="mt-2 grid grid-cols-4 text-xs text-gray-500">
      <div>
        <div className="text-xs">Ккал</div>
        <div className="text-orange-600 font-medium">{recipe?.total_kcal.toFixed(0)  || 0}</div>
      </div>
      <div>
        <div className="text-xs">Б</div>
        <div className="text-green-600 font-medium">{recipe?.total_proteins?.toFixed(0)  || 0}</div>
      </div>
      <div>
        <div className="text-xs">Ж</div>
        <div className="text-blue-600 font-medium">{recipe?.total_fats?.toFixed(0) || 0}</div>
      </div>
      <div>
        <div className="text-xs">В</div>
        <div className="text-purple-600 font-medium">{recipe?.total_carbs?.toFixed(0)  || 0}</div>
      </div>
    </div>

      </div>
    </div>
  );
}
