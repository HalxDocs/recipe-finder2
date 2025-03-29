import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchRecipes = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Using the Edamam Recipe API
      // In a real application, you would want to hide the API key in an environment variable
      const APP_ID = 'YOUR_APP_ID';
      const APP_KEY = 'YOUR_APP_KEY';
      const response = await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      const data = await response.json();
      setRecipes(data.hits);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes();
  };

  return (
    <div className="App">
      <header>
        <h1>Recipe Finder</h1>
        <p>Find delicious recipes with the ingredients you have</p>
      </header>
      
      <form onSubmit={handleSubmit} className="search-form">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter ingredients or dish name..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      
      {loading && <p className="loading">Loading recipes...</p>}
      {error && <p className="error">{error}</p>}
      
      <div className="recipes-container">
        {recipes.length > 0 ? (
          recipes.map((item, index) => (
            <div key={index} className="recipe-card">
              <img 
                src={item.recipe.image} 
                alt={item.recipe.label} 
                className="recipe-image"
              />
              <div className="recipe-info">
                <h2>{item.recipe.label}</h2>
                <p>{Math.round(item.recipe.calories)} calories</p>
                <p>{item.recipe.ingredientLines.length} ingredients</p>
                <div className="recipe-tags">
                  {item.recipe.dietLabels.map((tag, i) => (
                    <span key={i} className="tag diet-tag">{tag}</span>
                  ))}
                  {item.recipe.healthLabels.slice(0, 3).map((tag, i) => (
                    <span key={i} className="tag health-tag">{tag}</span>
                  ))}
                </div>
                <a 
                  href={item.recipe.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  View Recipe
                </a>
              </div>
            </div>
          ))
        ) : !loading && (
          <p className="no-results">
            {query ? "No recipes found. Try another search!" : "Search for recipes to get started!"}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
