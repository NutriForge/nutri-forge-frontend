import { useState } from "react";
import { Button } from "@/components/ui/button";

interface IngredientForm {
  name: string;
  proteins: string;
  fats: string;
  carbs: string;
  kcal: string;
}

export default function AddMissingIngredientsModal({
  missingIngredients,
  onClose,
  onSave,
}: {
  missingIngredients: string[];
  onClose: () => void;
  onSave: (ingredient: IngredientForm) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, IngredientForm>>(
    {}
  );

  const handleToggle = (name: string) => {
    setExpanded(expanded === name ? null : name);
    if (!formValues[name]) {
      setFormValues((prev) => ({
        ...prev,
        [name]: {
          name,
          proteins: "",
          fats: "",
          carbs: "",
          kcal: "",
        },
      }));
    }
  };

  const handleInputChange = (
    name: string,
    field: keyof IngredientForm,
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4">
      <div className="w-[700px] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-900">
            Додати відсутні інгредієнти
          </h2>
          <button
            onClick={onClose}
            className="-mt-2 -me-2 p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            ✕
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {missingIngredients.map((name) => (
            <li key={name} className="border rounded p-3">
              <div
                className="cursor-pointer font-medium text-teal-700 hover:underline"
                onClick={() => handleToggle(name)}
              >
                {name}
              </div>

              {expanded === name && (
                <div className="mt-3 space-y-2 text-sm">
                  {["name", "proteins", "fats", "carbs", "kcal"].map(
                    (field) => (
                      <input
                        key={field}
                        type="text"
                        className="w-full border px-2 py-1 rounded"
                        placeholder={
                          field === "name"
                            ? "Назва інгредієнта"
                            : `${field} (на 100 г)`
                        }
                        value={
                          formValues[name]?.[field as keyof IngredientForm] ||
                          ""
                        }
                        onChange={(e) =>
                          handleInputChange(
                            name,
                            field as keyof IngredientForm,
                            e.target.value
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            onClick={onClose}
            className="bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            Закрити
          </Button>
          <Button className="bg-teal-600 text-white hover:bg-teal-700">
            Зберегти
          </Button>
        </div>
      </div>
    </div>
  );
}
