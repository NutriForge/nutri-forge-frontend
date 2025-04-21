import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './components/Recipe/RecipeList';
import RecipePage from './components/Recipe/RecipePage';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<RecipeList />} />
          <Route path="recipe/:id" element={<RecipePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;