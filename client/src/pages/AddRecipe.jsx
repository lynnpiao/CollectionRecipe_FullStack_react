import FullRecipeForm from "../components/FullRecipeForm";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";



const AddRecipe = () => {

    const navigate = useNavigate();

    // Create New Recipe
    const createRecipe = ({ newRecipe, newProcedures, selectedIngredients }) => {
        axios.post('http://localhost:8000/api/recipes', newRecipe, {
            headers: {
                accessToken: localStorage.getItem('accessToken')
            }
        })
        .then(recipeResponse => {
            const createdRecipe = recipeResponse.data.recipe; // Ensure you access the correct property
            const recipeId = createdRecipe.id;
            console.log('Recipe created:', createdRecipe);
            
            console.log(newProcedures);
            // Create Procedures
            if (newProcedures.length > 0) {
                axios.post(`http://localhost:8000/api/procedures/${recipeId}`, {procedures: newProcedures }, {
                    headers: {
                        accessToken: localStorage.getItem('accessToken')
                    }
                })
                .then(proceduresResponse => {
                    const createdProcedures = proceduresResponse.data;
                    console.log('Procedures created:', createdProcedures);
                })
                .catch(error => {
                    console.error(`Error creating procedures for the recipe of ${recipeId}`, error);
                    toast.error(`Failed to create procedures for the recipe of ${recipeId}. Please try again.`);
                });
            } else {
                console.log('No procedures added in recipe');
            }

            // Create Ingredients
            console.log(selectedIngredients);
            if (selectedIngredients.length > 0) {
                axios.post(`http://localhost:8000/api/ingredients/${recipeId}`, {ingredients: selectedIngredients}, {
                    headers: {
                        accessToken: localStorage.getItem('accessToken')
                    }
                })
                .then(ingredientsResponse => {
                    const createdIngredients = ingredientsResponse.data;
                    console.log('Ingredients created:', createdIngredients);
                })
                .catch(error => {
                    console.error(`Error creating ingredients for the recipe of ${recipeId}`, error);
                    toast.error(`Failed to create ingredients for the recipe of ${recipeId}. Please try again.`);
                });
            } else {
                console.log('No ingredients added in recipe');
            }

            toast.success('Successfully created recipe');
            // navigate("/myrecipes");

        })
        .catch(error => {
            console.error('Error creating main part of the recipe:', error);
            toast.error('Failed to create main part of the recipe. Please try again.');
        });
    };


return (
        <>
            <FullRecipeForm RecipeSubmit={createRecipe}/>
        </>

)};

export default AddRecipe