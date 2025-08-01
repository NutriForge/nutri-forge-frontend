import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { getIngredientsInfo } from "@/services/recipeService";
import { IngredientInfo } from "@/types/recipe";

export default function RecipePreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    title = "Назва рецепту",
    recipeText = "",
    imageUrl = "https://placehold.co/400x200?text=Фотосесія+триває",
    imageFile = null,
    ingredients = [],
    steps = [],
  } = location.state || {};

  const [totals, setTotals] = useState({
    proteins: 0,
    fats: 0,
    carbs: 0,
    kcal: 0,
  });

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const names = ingredients.map((ing: IngredientInfo) => ing.name);
        const infos = await getIngredientsInfo(names);

        const total = infos.reduce(
          (acc, info, index) => {
            const weightFactor = ingredients[index].weight_in_g / 100;
            return {
              proteins: acc.proteins + info.proteins * weightFactor,
              fats: acc.fats + info.fats * weightFactor,
              carbs: acc.carbs + info.carbs * weightFactor,
              kcal: acc.kcal + info.kcal * weightFactor,
            };
          },
          { proteins: 0, fats: 0, carbs: 0, kcal: 0 }
        );

        setTotals(total);
      } catch (e) {
        console.error("Помилка при отриманні БЖВК:", e);
      }
    };
    fetchNutrition();
  }, [ingredients]);

  const handleBack = () => {
    navigate("/recipes/add", {
      state: {
        title,
        recipeText,
        imageFile,
        ingredients,
        steps,
        imageUrl,
      },
    });
  };

  return (
    <div>
      {/* Головна секція зліва + картинка справа */}
      <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {title}
            </h2>

            <p className="hidden text-gray-500 md:mt-4 md:block">
              Перевірте інгредієнти й кроки перед збереженням рецепту.
            </p>
          </div>
        </div>

        <img
          alt="Зображення рецепту"
          src={imageUrl}
          className="h-56 sm:h-auto max-h-64 w-full object-cover"
        />
      </section>

      {/* Інгредієнти + кроки */}
      <div className="mt-10 overflow-hidden sm:grid sm:grid-cols-2 gap-20 px-8">
        {/* Інгредієнти */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl pb-4">
            Інгредієнти
          </h2>
          <ul className="border rounded-lg p-4 bg-white space-y-3 text-sm text-gray-700">
            {ingredients.map((ingredient: any, index: number) => (
              <li
                key={index}
                className="flex flex-col border-b pb-2 gap-1"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="w-1/3">{ingredient.name}</span>
                  <div className="text-right">
                    {ingredient.weight_in_g} г
                  </div>
                </div>
              </li>
            ))}
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Загальна вага:</label>
            <span className="text-sm text-gray-500"> {ingredients.reduce((sum, ing) => sum + ing.weight_in_g, 0)} г</span>
            </li>
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Білки:</label>
            <span className="text-sm text-gray-500"> {totals.proteins.toFixed(1)} г</span>
            </li>
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Жири:</label>
            <span className="text-sm text-gray-500"> {totals.fats.toFixed(1)} г</span>
            </li>
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Вуглеводи:</label>
            <span className="text-sm text-gray-500"> {totals.carbs.toFixed(1)} г</span>
            </li>
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Калорійність:</label>
            <span className="text-sm text-gray-500"> {totals.kcal.toFixed(1)} ккал</span>
            </li>
          </ul>
        </div>

        {/* Кроки */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl pb-4">
            Кроки
          </h2>
          <ol className="list-decimal list-inside rounded-lg p-4 bg-white space-y-5 text-m text-gray-700">
            {steps.map((step: any, index: number) => (
              <li key={index}>
                {step.description}
              </li>
            ))}
          </ol>
      </div>
              </div>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={handleBack}>
                Назад
              </Button>
              <Button className="bg-teal-600 text-white hover:bg-teal-700">
                Підтвердити
              </Button>
            </div>
    </div>
  );
}