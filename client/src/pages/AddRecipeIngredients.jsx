import { useLoaderData, useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import axios from 'axios';

const AddRecipeIngredients = () => {
    const navigate = useNavigate();

    const ingredients = useLoaderData();
    const [allIngredients, setAllIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [recipeUserId, setRecipeUserId] = useState(null);
    const { authState } = useContext(AuthContext);
   
    let { id } = useParams();

    const fetchAllIngredients = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/ingredients/');
            setAllIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
            toast.error('Failed to fetch ingredients');
        }
    };

    const fetchRecipeUserId = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/recipes/ById/${id}`);
            setRecipeUserId(response.data[0].userId);

        } catch (error) {
            console.error('Error fetching recipe:', error);
            toast.error('Failed to fetch recipe');
        }
    };

    useEffect(() => {
        fetchAllIngredients();
        fetchRecipeUserId();
    }, [])

    let leftIngredients = allIngredients;

    if (ingredients && ingredients.length > 0) {
        leftIngredients = allIngredients.filter(ingredient => !ingredients.some(i => i.ingredientId === ingredient.id));
    }

    const handleCheckboxChange = (id) => {
        setSelectedIngredients(prevSelected => {
            if (prevSelected.find(item => item.id === id)) {
                // Remove the ingredient if already selected
                return prevSelected.filter(item => item.id !== id);
            } else {
                // Add the ingredient with an initial amount of '1'
                return [...prevSelected, { id, amount: '1' }];
            }
        });
    };

    const handleAmountChange = (id, amount) => {
        setSelectedIngredients(prevSelected => {
            return prevSelected.map(item => {
                if (item.id === id) {
                    return { ...item, amount: amount };
                }
                return item;
            });
        });
    };

    const submitAddIngredient = () => {
        if (selectedIngredients.length > 0) {
            try {
                const ingredientsResponse = axios.post(`http://localhost:8000/api/ingredients/${id}`, { ingredients: selectedIngredients }, {
                    headers: {
                        accessToken: localStorage.getItem('accessToken')
                    }
                });
                const createdIngredients = ingredientsResponse.data;
                console.log('Ingredients created:', createdIngredients);
                navigate(`/ingredients/${id}`)
            } catch (error) {
                console.error(`Error creating ingredients for the recipe of ${id}`, error);
                toast.error(`Failed to create ingredients for the recipe of ${id}. Please try again.`);
            }
        } else {
            console.log('No ingredients added in recipe');
        }
    };

    return (
        <>
            <div className="container m-auto box-border h-32">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (authState.id === recipeUserId) {
                            submitAddIngredient();
                        } else {
                            toast.error('You are not authorized to add ingredients to this recipe.');
                        }
                    }}>
                        <div className='bg-white rounded-xl shadow-md'>
                            <h3 className='text-xl font-bold'> Add Recipe Ingredients</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* <div className="left"> */}
                                <ul>
                                    {leftIngredients.map(ingredient => (
                                        <li key={ingredient.id}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIngredients.some(item => item.id === ingredient.id)}
                                                    onChange={() => handleCheckboxChange(ingredient.id)}
                                                />
                                                {ingredient.name}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder=""
                                                value={selectedIngredients.find(item => item.id === ingredient.id)?.amount || ''}
                                                onChange={(e) => handleAmountChange(ingredient.id, e.target.value)}
                                            />
                                        </li>
                                    ))}
                                </ul>

                                <p>Selected ingredients: {selectedIngredients.map(item => item.id || item.id).join(', ')}</p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            Add
                        </button>
                        <Link to={`/ingredients/${id}`}>
                            <button
                                type="button"
                                className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                Cancel
                            </button>
                        </Link>
                    </form>
                </div>
            </div>

        </>
    )
}


export { AddRecipeIngredients as default }