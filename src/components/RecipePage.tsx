import { useParams } from 'react-router-dom';

const recipes = {
  1: { id: 1, name: "Омлет із овочами", ingredients: ["яйця", "помідор", "сир"] },
  2: { id: 2, name: "Гречка з грибами", ingredients: ["гречка", "гриби", "цибуля"] },
};

function RecipePage() {
  const { id } = useParams();
  const recipe = recipes[Number(id)];

  if (!recipe) return <div>Рецепт не знайдено</div>;

  return (
    <div>
      <h1>{recipe.name}</h1>
      <ul>
        {recipe.ingredients.map((ing, index) => (
          <li key={index}>{ing}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecipePage;