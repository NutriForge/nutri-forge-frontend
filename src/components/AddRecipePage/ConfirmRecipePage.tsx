import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RecipePreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    title = "Назва рецепту",
    imageUrl = "/img/recipe_13.png",
    ingredients = [
    { name: "паста", amount: "33 г" },
    { name: "телятина", amount: "70 г" },
    { name: "цибуля", amount: "50 г" },
    { name: "сіль, щіпка", amount: "1 г" },
    { name: "томатна паста", amount: "20 г" },
    { name: "олія соняшникова", amount: "8 г" },
    { name: "часник", amount: "10 г" },
    { name: "сік лимона", amount: "10 г" },
    { name: "базилік або кріп", amount: "1 г" },
    ],
    steps = [
      "Пасту відварюємо у підсоленій воді до готовності.",
    "Обсмажуємо фарш, дрібно нарізану цибулю і часник протягом 5 хв на середньому вогні.",
    "Додаємо томатну пасту. Якщо вона кисла — лимонний сік не потрібен.",
    "Візьміть трохи води (близько чверті чашки), в якій вариться паста, і додайте в сковороду.",
    "Зменшіть вогонь і тушкуйте 3–5 хв. Спробуйте на смак. Якщо сильно кисло — додайте ще води.",
    ],
  } = location.state || {};

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
                    {ingredient.amount}
                  </div>
                </div>
              </li>
            ))}
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Загальна вага:</label>
            <span className="text-sm text-gray-500"> 100 г</span>
            </li>
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Білки:</label>
            <span className="text-sm text-gray-500"> 100 г</span>
            </li>
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Жири:</label>
            <span className="text-sm text-gray-500"> 100 г</span>
            </li>
            <li className="flex gap-1 py-px -my-0.5">
            <label className="text-s font-medium">Вуглеводи:</label>
            <span className="text-sm text-gray-500"> 100 г</span>
            </li>
          </ul>
        </div>

        {/* Кроки */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl pb-4">
            Кроки
          </h2>
          <ol className="list-decimal list-inside rounded-lg p-4 bg-white space-y-5 text-m text-gray-700">
            {steps.map((step: string, index: number) => (
              <li key={index}>
                {step}
              </li>
            ))}
          </ol>
      </div>
              </div>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Назад
              </Button>
              <Button className="bg-teal-600 text-white hover:bg-teal-700">
                Підтвердити
              </Button>
            </div>
    </div>
  );
}