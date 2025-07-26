import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddRecipePage() {
  const [title, setTitle] = useState('');
  const [recipeText, setRecipeText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = () => {
    console.log({ title, recipeText, image });
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Додати новий рецепт</h1>

        <div className="mb-6">
          <label className="block text-base font-medium mb-2 text-gray-700">
            Назва рецепта
          </label>
          <Input
            placeholder="Наприклад, Тост із сиром і овочами"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl text-base py-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-base font-medium mb-2 text-gray-700">
            Рецепт (інгредієнти + кроки)
          </label>
          <Textarea
            className="w-full min-h-[300px] rounded-xl text-base py-2"
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            placeholder="Введіть весь рецепт - перелік інгридієнтів і опис"
          />
        </div>

        <div className="mb-4">
          <label className="block text-base font-medium mb-2 text-gray-700">
            Зображення
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="w-1/2 h-60 border border-dashed border-gray-300 rounded-xl flex flex-col justify-center items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
          >
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-full h-full object-cover rounded-xl"
              />
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
                  Натисни або перетягни зображення сюди
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

        <div className="mb-6">
          <div className="flex items-start gap-2 bg-[#f1f5f9] border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3">
            <span className="text-xl">💡</span>
            <p>
              <strong>Підказка:</strong> Healthy breakfast toast with grilled vegetables and boiled egg on a white plate, minimalistic style, top view
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200">Відміна</Button>

<Button className="bg-teal-600 text-white hover:bg-teal-700" onClick={handleSubmit}>Зберегти</Button>
        </div>
      </div>
    </div>
  );
}
