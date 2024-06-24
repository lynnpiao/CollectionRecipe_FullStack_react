import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../utils/AuthContext";
import LoginPromptModal from '../components/LoginPromptModal';
import axios from 'axios';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { toast } from 'react-toastify';

const RecipeReviews = () => {
  let { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const navigate = useNavigate();
  const recipe = useLoaderData();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { authState } = useContext(AuthContext);

  const fetchReviews = async () => {

    try {
      const response = await axios.get(`http://localhost:8000/api/reviews/${id}`);
      console.log(response.data);
      setReviews(response.data); // Ensure this matches the shape of your data
    } catch (error) {
      console.error('Error loading recipe:', error);
      throw new Response('Failed to load recipe', { status: 500 });
    }

  };

  useEffect(() => {
    fetchReviews();
  }, []);


  const addReview = async () => {

    if (authState.status === true) {
      try {
        const response = await axios.post(
          'http://localhost:8000/api/reviews/',
          {
            comment: newReview,
            userId: authState.id,
            recipeId: recipe.id
          },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        );
        const reviewToAdd = {
          id: response.data.id, // Assuming the API returns the new review's ID
          comment: newReview,
          userEmail: authState.email, // Assuming authState has the user's email
          userId: authState.id, // Assuming authState has the user's ID
        };
        setReviews([...reviews, reviewToAdd]);
        setNewReview("");
        toast.success('Review added successfully');
      } catch (error) {
        console.error('Error adding review:', error);
        toast.error('Failed to add review');
      }
    } else {
      setShowLoginPrompt(true);
    }
  };

  const deleteReview = async (reviewId) => {

    // Display confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) {
      return; // If user cancels, exit the function
    }

    try {
      const response = await axios.delete(`http://localhost:8000/api/reviews/${reviewId}`, {
        headers: { accessToken: localStorage.getItem('accessToken') },
      });

      setReviews(reviews.filter(review => review.id !== reviewId));
      toast.success('Deleted review successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }

  };

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

      toast.success('Deleted recipe successfully');
      navigate('/myrecipes')
    } catch (error) {
      console.error('Error deleting recipe:', error);
      // toast.error('Failed to delete recipe');
    }
  };

  return (
    <div className="container mx-auto w-full flex flex-col md:flex-row items-start">
      <div className="w-full md:w-1/2 mb-6 md:mb-0">
        <RecipeCard recipe={recipe} onDelete={deleteRecipe} isHome={false} />
      </div>
      <div className="w-full md:w-1/2 p-6 rounded-lg mt-5">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <input
            type="text"
            placeholder="Write a review..."
            className="bg-gray-50 h-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            autoComplete="off"
            value={newReview}
            onChange={(event) => setNewReview(event.target.value)}
          />
          <button
            type="button"
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={addReview}
          >
            Add Review
          </button>
        </div>

        <div className="bg-white shadow-md rounded-md border m-4 md:m-0">
          {reviews.map(review => (
            <div key={review.id} className="border-b border-dashed border-gray-300 p-4 flex items-start justify-between">
              <div>
                <p className="text-gray-700 text-sm font-bold">{review.comment}</p>
                <p className="text-gray-500 text-sm">User: {review.userEmail.split('@')[0]}</p>
              </div>
              {authState.id === review.userId && (
                <button
                  type="button"
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={() => deleteReview(review.id)}
                >
                  <RiDeleteBin6Fill />
                </button>
              )}
            </div>
          ))}
        </div>

        <LoginPromptModal
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
        />
      </div>
    </div>
  );
};

export default RecipeReviews