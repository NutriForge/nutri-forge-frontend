import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateRecipeSteps } from "@/services/recipeService";

type Step = {
  id?: number;              // UUID з БД; для нових може бути undefined (тимчасовий)
  step_number?: number;     // 1..N
  description: string;
};

interface StepsCardProps {
  recipeId: string;
  initialSteps: Step[];
  isEditMode: boolean;
}

export default function StepsCard({ recipeId, initialSteps, isEditMode }: StepsCardProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [saving, setSaving] = useState(false);

  // локальні чернетки (щоб порівняти із initialSteps)
  useEffect(() => {
    setSteps((initialSteps ?? []).map((s, i) => ({
      id: s.id,
      description: s.description ?? "",
      step_number: s.step_number ?? i + 1,
    })));
  }, [recipeId, JSON.stringify(initialSteps)]); // простий ресет при зміні даних

  const isDirty = useMemo(() => {
    // просте порівняння: кількість + опис кожного кроку
    if ((initialSteps?.length ?? 0) !== steps.length) return true;
    for (let i = 0; i < steps.length; i++) {
      const a = steps[i];
      const b = initialSteps[i];
      if ((b?.description ?? "") !== (a?.description ?? "")) return true;
    }
    return false;
  }, [steps, initialSteps]);

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: undefined, // новий — створиться на бекенді
        step_number: prev.length + 1,
        description: "",
      },
    ]);
  }

  function removeStep(index: number) {
    const ok = window.confirm("Видалити цей крок?");
    if (!ok) return;
    setSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, step_number: i + 1 }))
    );
  }

  function changeStep(index: number, description: string) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, description } : s))
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      // готуємо payload: бек приймає повний список у правильному порядку
      const payload = steps.map((s, i) => ({
        id: s.id, // для нових — undefined/null
        step_number: i + 1,
        description: (s.description || "").trim(),
      }));
      const res = await updateRecipeSteps(recipeId, payload);
      // очікуємо повернення нормалізованого списку з id/step_number
      setSteps(
        (res?.steps ?? payload).map((s: any, i: number) => ({
          id: s.id,
          step_number: s.step_number ?? i + 1,
          description: s.description ?? "",
        }))
      );
      alert("Кроки збережено ✅");
    } catch (e) {
      console.error(e);
      alert("Не вдалося зберегти кроки.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    // повертаємось до початкових кроків
    setSteps((initialSteps ?? []).map((s, i) => ({
      id: s.id,
      description: s.description ?? "",
      step_number: s.step_number ?? i + 1,
    })));
  }

  // --- View mode ---
  if (!isEditMode) {
    if (!steps?.length) {
      return <div className="p-4 text-gray-500">Кроків поки немає.</div>;
    }
    return (
      <div className="p-4">
        <ol className="space-y-4 list-decimal list-inside text-gray-800">
          {steps.map((s, idx) => (
            <li key={s.id ?? `tmp-${idx}`} className="pl-1">
              <span className="whitespace-pre-line">{s.description}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // --- Edit mode ---
  return (
    <div className="p-4 border rounded-xl bg-white">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Редагування кроків
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCancel} disabled={!isDirty || saving} className="rounded-xl">
            Скасувати
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || saving} className="rounded-xl">
            {saving ? "Збереження…" : "Зберегти"}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((s, idx) => (
          <div key={s.id ?? `tmp-${idx}`} className="flex items-start gap-3">
            <div className="mt-2 w-6 text-right text-sm text-gray-500">{idx + 1}.</div>
            <textarea
              value={s.description}
              onChange={(e) => changeStep(idx, e.target.value)}
              placeholder={`Опис кроку ${idx + 1}`}
              className="flex-1 min-h-[64px] resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
            <button
              type="button"
              onClick={() => removeStep(idx)}
              className="mt-1 rounded-full p-2 transition hover:bg-gray-100"
              title="Видалити крок"
              aria-label="Видалити крок"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24" strokeWidth={1.6} stroke="currentColor"
                   className="h-5 w-5 text-gray-600 hover:text-rose-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.04-3.21c.342.052.682.108 1.022.17M4.68 5.79c.34-.062.68-.118 1.022-.17m2.02-.34A48.108 48.108 0 0114.28 5.5m-5.558 0V4.5A1.5 1.5 0 0110.22 3h3.56a1.5 1.5 0 011.5 1.5V5.5m-8.56 0h10.56M6.5 7l.7 12.2A2 2 0 009.2 21h5.6a2 2 0 001.999-1.8L17.5 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button
          type="button"
          onClick={addStep}
          variant="outline"
          className="rounded-xl"
        >
          + Додати крок
        </Button>
      </div>
    </div>
  );
}
