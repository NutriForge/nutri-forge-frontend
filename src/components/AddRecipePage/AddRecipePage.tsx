import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateIngredients, saveIngredients, parseRecipe } from "@/services/recipeService";
import AddMissingIngredientsModal from "./AddMissingIngredientsModal";
import { IngredientForm, Recipe } from "@/types/recipe";
import { useNavigate, useLocation } from "react-router-dom";

export default function AddRecipePage() {
  // Form states
  const [title, setTitle] = useState("");
  const [recipeText, setRecipeText] = useState("");
  const [parsedRecipe, setParsedRecipe] = useState<Recipe | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal for adding missing ingredients
  const [isIngredientModalOpen, setisIngredientModalOpen] = useState(false);
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill data if navigated from another page with state
  useEffect(() => {
    if (location.state) {
      setTitle(location.state.title || "");
      setRecipeText(location.state.recipeText || "");
      setParsedRecipe({
        id: "",
        name: title,
        img: location.state.imageUrl || "",
        ingredients: location.state.ingredients || [],
        steps: location.state.steps || [],
      });
      if (location.state.imageFile) {
        setImage(location.state.imageFile);
      }
    }
  }, []);

  // Handle image selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Remove selected image
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent file picker on click
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const structuredRecipe = await parseRecipe(title, recipeText);
      setParsedRecipe(structuredRecipe);

      const ingredientNames = structuredRecipe.ingredients?.map((ing) => ing.name) || [];
      const missing = await validateIngredients(ingredientNames);

      if (missing.length > 0) {
        setisIngredientModalOpen(true);
        setMissingIngredients(missing);
      } else {
        setMissingIngredients([]);
        navigate("/recipes/confirm", {
          state: {
            title,
            recipeText,
            type: structuredRecipe.type,
            imageFile: image,
            imageUrl: image
              ? URL.createObjectURL(image)
              : "https://placehold.co/400x200?text=Photo+in+progress",
            ingredients: structuredRecipe.ingredients,
            steps: structuredRecipe.steps,
          },
        });
      }
    } catch (error) {
      console.error("❌ Validation error:", error);
    }
  };

  // Save missing ingredients to DB
  const handleSaveIngredients = async (ingredientsArray: IngredientForm[]) => {
    try {
      await saveIngredients(ingredientsArray);

      if (!parsedRecipe) {
        console.error("parsedRecipe is null");
        return;
      }

      setisIngredientModalOpen(false);

      navigate("/recipes/confirm", {
        state: {
          title,
          recipeText,
          type: parsedRecipe.type,
          imageFile: image,
          imageUrl: image
            ? URL.createObjectURL(image)
            : "https://placehold.co/400x200?text=Photo+in+progress",
          ingredients: parsedRecipe.ingredients,
          steps: parsedRecipe.steps,
        },
      });
    } catch (error) {
      console.error("Unable to save ingredients:", error);
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Add a New Recipe
        </h1>

        {/* Recipe title */}
        <div className="mb-6">
          <label className="block text-base font-medium mb-2 text-gray-700">
            Recipe Title
          </label>
          <Input
            placeholder="E.g., Toast with cheese and vegetables"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl text-base py-2"
          />
        </div>

        {/* Recipe text */}
        <div className="mb-6">
          <label className="block text-base font-medium mb-2 text-gray-700">
            Recipe (ingredients + steps)
          </label>
          <Textarea
            className="w-full min-h-[300px] rounded-xl text-base py-2"
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            placeholder="Enter the full recipe - ingredient list and instructions"
          />
        </div>

        {/* Image upload */}
        <div className="mb-4">
          <label className="block text-base font-medium mb-2 text-gray-700">
            Image
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => {
              if (!image) fileInputRef.current?.click();
            }}
            className="relative w-1/2 h-60 border border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition group"
          >
            {image ? (
              <>
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-full object-cover rounded-xl"
                />
                {/* Trash button appears on hover */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Remove image"
                >
                  {/* Trash icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 7h12M9 7V4h6v3m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10 text-gray-400 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5v-9m4.5 4.5h-9M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z"
                  />
                </svg>
                <span className="text-gray-600 text-sm text-center px-4">
                  Click or drag image here
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Prompt helper */}
        <div className="mb-6">
          <div className="flex items-start gap-2 bg-[#f1f5f9] border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3">
            <span className="text-xl">💡</span>
            <p>
              <strong>Prompt for ChatGPT:</strong> <br /><br />
              Generate a photo of the dish. <br />
              A realistic, minimalist photo of a healthy meal served on a plain beige ceramic plate. 
              The plate is placed on a neutral beige linen background. The lighting is natural and soft, 
              with smooth shadows. No additional props or background elements. 
              <br />
              <code>{`{Insert recipe here}`}</code>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Cancel
          </Button>

          <Button
            className="bg-teal-600 text-white hover:bg-teal-700"
            onClick={handleSubmit}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modal for missing ingredients */}
      {isIngredientModalOpen && (
        <AddMissingIngredientsModal
          missingIngredients={missingIngredients}
          onClose={() => setisIngredientModalOpen(false)}
          onSave={handleSaveIngredients}
        />
      )}
    </div>
  );
}
