import { useState, useEffect, useContext } from 'react';
import RecipeCard from './RecipeCard';
import { toast } from 'react-toastify';
import { AuthContext } from "../utils/AuthContext";
import PropTypes from "prop-types";
import axios from 'axios';

const RecipeList = ({isHome = false}) => {
 
 const [recipes, setRecipes] = useState([]);
 const { authState } = useContext(AuthContext);

 let userId = authState.id;
 console.log(isHome)
 console.log(userId);

 const fetchRecipeList = async () => {
    const url = isHome ? 'http://localhost:8000/api/recipes' : `http://localhost:8000/api/recipes/${userId}`;

    try {
        console.log(url);
        const response = await axios.get(url, {
            ...(isHome ? {} : { headers: { accessToken: localStorage.getItem("accessToken") } })
          });
        const data = await response.data;
        setRecipes(data);
        console.log(data);

    } catch (error) {
        console.error("There was an error fetching recipes!", error);
        toast.error('Failed to fetch recipes');
    }
};

 useEffect(()=>{
    fetchRecipeList();
 }, []);

 // Function to handle recipe deletion
 const deleteRecipe = async (id) => {
    // Display confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');

    if (!confirmDelete) {
        return; // If user cancels, exit the function
    }

    try {
        const response = await axios.delete(`http://localhost:8000/api/recipes/${id}`, {
            headers: { accessToken: localStorage.getItem('accessToken') },
        });

        // After deletion, refetch ingredients
        await fetchRecipeList();// Assuming fetchIngredients updates state
        toast.success('Deleted recipe successfully');
        
    } catch (error) {
        console.error('Error deleting recipe:', error);
        // toast.error('Failed to delete recipe');
    }
};
 
  return (
    <div className='container m-auto w-150 box-border h-32'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
      {recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} onDelete={deleteRecipe} isHome={isHome}/>
            ))}
      </div>
    
  </div>
  )
}

RecipeList.propTypes = {
    isHome: PropTypes.bool.isRequired
};

export default RecipeList