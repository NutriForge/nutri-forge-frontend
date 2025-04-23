import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/Recipe/RecipeList';
import RecipePage from './components/Recipe/RecipePage/RecipePage';
import Layout from './components/Layout/Layout';

import { RecipeProvider } from './context/RecipeContext'; 

function App() {
  return (
    <RecipeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RecipeList />} />
          <Route path="recipe/:id" element={<RecipePage />} />
        </Route>
      </Routes>
    </Router>
    </RecipeProvider>
  );
}

export default App;