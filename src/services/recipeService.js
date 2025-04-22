export async function getRecipes() {
  const response = await fetch('/data/recipes.json'); // або твій майбутній API
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}