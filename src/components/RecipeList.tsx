import { Link } from 'react-router-dom';

const recipes = [
  { id: 1, name: "Омлет із овочами" },
  { id: 2, name: "Гречка з грибами" },
];

function RecipeList() {
  return (
    <div>
      <h1>Список рецептів</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeList;