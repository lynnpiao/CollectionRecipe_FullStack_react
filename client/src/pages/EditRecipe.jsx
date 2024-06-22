// import React, { useState, useEffect } from 'react';
import RecipeForm from "../components/RecipeForm";
import { useNavigate, useParams, useLoaderData} from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from "axios";

const EditRecipe = () => {
    const navigate = useNavigate();
    let { id } = useParams();
    
    // console.log(id);
    const recipe = useLoaderData();


    // Function to update recipe data
    const updateRecipe = async (updatedRecipe) => {
        console.log(updatedRecipe);
        try {
            // Example update request
            const response = await axios.put(`http://localhost:8000/api/recipes/${id}`, 
            {
              description: updatedRecipe.description,
              duration: updatedRecipe.duration,
              photoUrl: updatedRecipe.photoUrl

            }, {
                headers: {
                    accessToken: localStorage.getItem('accessToken')
                }
            });
            toast.success('Recipe updated successfully');
            console.log(response);
            navigate("/myrecipes"); // Navigate after successful update
        } catch (error) {
            console.error('Error updating recipe:', error);
            toast.error('Failed to update recipe. Please try again.');
        }
    };

    return (
        <>
            <RecipeForm recipe={recipe} onUpdateRecipe={updateRecipe} />
        </>
    );
}

const recipeLoader = async ({ params }) => {
  try {
      const response = await axios.get(`http://localhost:8000/api/recipes/ById/${params.id}`);
    //   console.log(response.data[0]);
      return response.data[0]; // Ensure this matches the shape of your data
  } catch (error) {
      console.error('Error loading recipe:', error);
      throw new Response('Failed to load recipe', { status: 500 });
  }
};



export {EditRecipe as default, recipeLoader};
