import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/Recipe/RecipeList';
import RecipePage from './components/Recipe/RecipePage/RecipePage';
import Layout from './components/Layout/Layout';
import MealPlannerPage from './components/MealPlannerPage/MealPlannerPage';
import AddRecipePage from './components/AddRecipePage/AddRecipePage';

import { RecipeProvider } from './context/RecipeContext'; 
import { IngredientsFormProvider } from './context/IngredientsFormContext';

function App() {
  return (
    <RecipeProvider>
      <IngredientsFormProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RecipeList />} />
          <Route path="recipe/:id" element={<RecipePage />} />
          <Route path="recipes/add" element={<AddRecipePage />} />
          <Route path="planner" element={<MealPlannerPage />} />
        </Route>
      </Routes>
    </Router>
      </IngredientsFormProvider>
    </RecipeProvider>
  );
}

export default App;