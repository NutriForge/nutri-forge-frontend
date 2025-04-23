export async function getAllRecipes() {
  const response = await fetch('/data/recipes.json');
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}