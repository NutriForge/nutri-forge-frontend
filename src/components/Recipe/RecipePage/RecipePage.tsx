import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRecipe, useIsRecipesLoading, useReloadRecipes } from "@/context/RecipeContext";
import { useIngredientsForm } from "@/context/IngredientsFormContext";

import IngredientsCard from "./IngredientsCard/IngredientsCard";
import StepsCard from "./StepsCard";
import { Button } from "@/components/ui/button";
import { Step } from "@/types/recipe";

import {
  getRecipe,
  deleteRecipe,
  setRecipeRating,
  addFavorite,
  removeFavorite,
  uploadRecipeImage,
  deleteRecipeImage,
  IMAGE_BASE_URL,
} from "@/services/recipeService";

function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isLoading = useIsRecipesLoading();
  const recipe = useRecipe(id || "");
  const { dispatch } = useIngredientsForm();
  const { state } = useIngredientsForm();
  const reloadRecipes = useReloadRecipes(); 

  // --- Local UI state ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  // action-specific state
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [steps, setSteps] = useState<Step[] | null>(null);

  // image state (local override so UI updates immediately)
  const [imgPath, setImgPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- Initial fetch for contextual data (ingredients + per-user flags) ---
  useEffect(() => {
    if (!id) return;
    syncRecipeFromApi(id).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // keep local image in sync with recipe if context changes
  useEffect(() => {
    if (recipe?.img && !imgPath) {
      setImgPath(recipe.img);
    }
  }, [recipe?.img]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <div>Завантаження…</div>;
  if (!recipe || !id) return <div>Рецепт не знайдено</div>;

  async function syncRecipeFromApi(recipeId: string) {
    const data = await getRecipe(recipeId);

    if (typeof data.is_favorite === "boolean") setIsFavorite(data.is_favorite);
    if (typeof data.avg_rating === "number") setAvgRating(data.avg_rating);
    if (typeof data.rating_count === "number") setRatingCount(data.rating_count);
    if (typeof data.user_rating === "number") setUserRating(data.user_rating);
    if (typeof data.img === "string") setImgPath(data.img ?? null);

    dispatch({ type: "SET_INGREDIENTS", payload: data.ingredients ?? [] });
    setSteps(data.steps ?? []);

    return data;
  }

  // --- Meal plan integration ---
  function handleAddToMealPlan() {
    const currentPlan = JSON.parse(localStorage.getItem("mealPlan") || "{}");

    const updatedRecipe = {
      ...recipe,
      ingredients: state.ingredients,
      weight_per_portion: state.totalWeight,
      total_proteins: state.totalMacros.proteins,
      total_carbs: state.totalMacros.carbs,
      total_fats: state.totalMacros.fats,
      total_kcal: state.totalMacros.kcal,
    };

    const newBreakfast = [
      ...(currentPlan.breakfast || []).filter((r: any) => r.id !== recipe.id),
      updatedRecipe,
    ];

    const updatedPlan = { ...currentPlan, breakfast: newBreakfast };
    localStorage.setItem("mealPlan", JSON.stringify(updatedPlan));
    navigate("/planner");
  }

  // --- Delete recipe ---
  async function handleDeleteRecipe() {
    const ok = window.confirm("Видалити рецепт? Цю дію неможливо скасувати.");
    if (!ok) return;

    try {
      setIsBusy(true);
      await deleteRecipe(id);
      await reloadRecipes();
      await syncRecipeFromApi(id);
      navigate("/recipes");
    } catch (e) {
      console.error(e);
      alert("Не вдалося видалити рецепт. Перевір права або мережу.");
    } finally {
      setIsBusy(false);
    }
  }

  // --- Favorite toggle (optimistic) ---
  async function handleToggleFavorite() {
    const next = !isFavorite;
    setIsFavorite(next);
    try {
      if (next) await addFavorite(id);
      else await removeFavorite(id);
    } catch (e) {
      console.error(e);
      setIsFavorite(!next); // revert
      alert("Не вдалося оновити улюблене. Спробуй знову.");
    }
  }

  // --- Rating (optimistic) ---
  async function handleRate(stars: number) {
    const prevUserRating = userRating;
    setUserRating(stars);
    try {
      const updated = await setRecipeRating(id, stars);
      if (updated?.avg_rating != null) setAvgRating(updated.avg_rating);
      if (updated?.rating_count != null) setRatingCount(updated.rating_count);
      if (updated?.user_rating != null) setUserRating(updated.user_rating);
    } catch (e) {
      console.error(e);
      setUserRating(prevUserRating ?? null);
      alert("Не вдалося зберегти оцінку.");
    }
  }

  // --- Image: replace/delete (shown on hover in Edit Mode) ---
  function triggerImagePicker() {
    fileInputRef.current?.click();
  }

  async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple client-side checks
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Підтримуються тільки JPG/PNG/WebP.");
      return;
    }
    const maxMB = 8;
    if (file.size > maxMB * 1024 * 1024) {
      alert(`Файл завеликий. Максимум ${maxMB} MB.`);
      return;
    }

    try {
      setIsBusy(true);
      const result = await uploadRecipeImage(id, file); // expect { img: string }
      if (result?.img) {
        setImgPath(result.img);
        await reloadRecipes();
        await syncRecipeFromApi(id);
      } else {
        // fallback: force reload
        setImgPath((prev) => prev ? `${prev}?t=${Date.now()}` : prev);
      }
    } catch (e: any) {
      console.error(e);
      alert(
        e?.status === 413
          ? "Зображення завелике для сервера. Зменш розмір і спробуй ще раз."
          : "Не вдалося завантажити зображення."
      );
    } finally {
      // reset file input and busy state
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsBusy(false);
    }
  }

  async function handleDeleteImage() {
    const ok = window.confirm("Видалити фото рецепту?");
    if (!ok) return;

    try {
      setIsBusy(true);
      await deleteRecipeImage(id);
      setImgPath(null);
      await reloadRecipes();
      await syncRecipeFromApi(id);
    } catch (e) {
      console.error(e);
      alert("Не вдалося видалити зображення.");
    } finally {
      setIsBusy(false);
    }
  }

  // --- Stars rendering helper ---
  const effectiveFilled = hoverRating || (userRating ?? Math.round(avgRating));

  return (
    <div>
      {/* Hero section with image + header/action bar */}
      <section className="overflow-hidden bg-gray-50 sm:grid sm:grid-cols-2">
        {/* Left: title + actions */}
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl">
            {/* Title + icon group */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {recipe.name}
              </h1>

              <div className="flex items-center gap-1">
                {/* Favorite (heart) */}
                <button
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  onClick={handleToggleFavorite}
                  className="rounded-full p-2 transition hover:bg-gray-200"
                  title={isFavorite ? "Улюблене" : "Додати в улюблене"}
                >
                  {isFavorite ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                         className="h-6 w-6 fill-current text-rose-600">
                      <path d="M12 21s-6.716-4.297-9.428-7.01C.857 12.274.5 10.7.5 9.5A5.5 5.5 0 0 1 11 6.146 5.5 5.5 0 0 1 23.5 9.5c0 1.2-.357 2.774-2.072 4.49C18.716 16.703 12 21 12 21z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         strokeWidth={1.5} stroke="currentColor"
                         className="h-6 w-6 text-gray-600">
                      <path strokeLinecap="round" strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 5.25 9 11.25 9 11.25s9-6 9-11.25z"/>
                    </svg>
                  )}
                </button>

                {/* Edit (pencil) */}
                <button
                  aria-label={isEditMode ? "Вийти з режиму редагування" : "Редагувати рецепт"}
                  onClick={() => setIsEditMode((v) => !v)}
                  className="rounded-full p-2 transition hover:bg-gray-200"
                  title={isEditMode ? "Завершити редагування (без збереження)" : "Редагувати"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"
                       className={`h-6 w-6 ${isEditMode ? "text-emerald-600" : "text-gray-600"}`}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.313 3 21l1.688-4.5L16.862 3.487z" />
                  </svg>
                </button>

                {/* Delete (trash) */}
                <button
                  aria-label="Видалити рецепт"
                  onClick={handleDeleteRecipe}
                  disabled={isBusy}
                  className="rounded-full p-2 transition hover:bg-gray-200 disabled:opacity-60"
                  title="Видалити"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"
                       className="h-6 w-6 text-gray-600 hover:text-rose-600">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.04-3.21c.342.052.682.108 1.022.17M4.68 5.79c.34-.062.68-.118 1.022-.17m2.02-.34A48.108 48.108 0 0114.28 5.5m-5.558 0V4.5A1.5 1.5 0 0110.22 3h3.56a1.5 1.5 0 011.5 1.5V5.5m-8.56 0h10.56M6.5 7l.7 12.2A2 2 0 009.2 21h5.6a2 2 0 001.999-1.8L17.5 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stars + CTA */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* Stars */}
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = i + 1;
                  const filled = idx <= effectiveFilled;
                  return (
                    <button
                      key={idx}
                      className="p-1"
                      onMouseEnter={() => setHoverRating(idx)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRate(idx)}
                      aria-label={`Оцінити на ${idx}`}
                      title={`Оцінити на ${idx}`}
                    >
                      {filled ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                             className="h-6 w-6 fill-current text-amber-500">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.035a1 1 0 0 0-1.176 0l-2.802 2.035c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"
                             className="h-6 w-6 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round"
                                d="M11.48 3.5c.27-.8 1.27-.8 1.54 0l1.27 3.9c.12.37.47.62.86.62h4.05c.84 0 1.19 1.08.51 1.57l-3.28 2.38a1 1 0 0 0-.36 1.12l1.25 3.85c.27.83-.68 1.52-1.39 1.01l-3.33-2.42a1 1 0 0 0-1.17 0l-3.33 2.42c-.72.51-1.66-.18-1.39-1.01l1.25-3.85a1 1 0 0 0-.36-1.12L4.09 9.59c-.68-.49-.33-1.57.51-1.57h4.05c.39 0 .74-.25.86-.62l1.27-3.9z"/>
                        </svg>
                      )}
                    </button>
                  );
                })}
                <span className="ml-2 text-sm text-gray-600">
                  {avgRating.toFixed(1)} ({ratingCount})
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToMealPlan}
                className="ml-auto bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-xl transition"
              >
                Додати в план
              </button>
            </div>
          </div>
        </div>

        {/* Right: image with edit overlay (only in Edit Mode) */}
        <div className="relative group">
          <img
            alt={recipe.name}
            src={
              imgPath
                ? `${IMAGE_BASE_URL}${imgPath}`
                : "https://placehold.co/400?text=Фотосесія+рецепту+триває"
            }
            className="h-56 w-full object-cover sm:h-full"
          />

          {/* Hover overlay appears only when Edit Mode is ON */}
          {isEditMode && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                {/* Replace image */}
                <button
                  type="button"
                  onClick={triggerImagePicker}
                  className="rounded-full bg-white/80 p-2 hover:bg-white shadow"
                  title="Змінити фото"
                  aria-label="Змінити фото"
                >
                  {/* simple "arrow-up-on-square" like upload icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"
                       className="h-5 w-5 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                </button>

                {/* Delete image (gray icon, as requested) */}
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="rounded-full bg-white/80 p-2 hover:bg-white shadow"
                  title="Видалити фото"
                  aria-label="Видалити фото"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                       viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"
                       className="h-5 w-5 text-gray-700">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.04-3.21c.342.052.682.108 1.022.17M4.68 5.79c.34-.062.68-.118 1.022-.17m2.02-.34A48.108 48.108 0 0114.28 5.5m-5.558 0V4.5A1.5 1.5 0 0110.22 3h3.56a1.5 1.5 0 011.5 1.5V5.5m-8.56 0h10.56M6.5 7l.7 12.2A2 2 0 009.2 21h5.6a2 2 0 001.999-1.8L17.5 7" />
                  </svg>
                </button>
              </div>

              {/* Hidden file input for image picker */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelected}
                className="hidden"
              />
            </>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mt-10 overflow-hidden sm:grid sm:grid-cols-2">
        <div>
          <IngredientsCard recipe={recipe} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl pb-4">
              Кроки
            </h2>
            {/* TODO: When implementing editable steps, show Save/Cancel here when isEditMode === true */}
          </div>

          {/* View-only steps for now; switch to editable list in a future iteration */}
          <StepsCard
            recipeId={id}
            initialSteps={steps ?? []}
            isEditMode={isEditMode}
          />

          <div className="mt-6 flex justify-end">
            <Button onClick={handleAddToMealPlan} className="h-12 rounded-xl">
              Додати в план
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
