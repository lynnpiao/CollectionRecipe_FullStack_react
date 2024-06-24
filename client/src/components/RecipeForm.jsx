import { useState, useEffect, useContext } from 'react';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import { AuthContext } from "../utils/AuthContext";
import { toast } from 'react-toastify';


const RecipeForm = ({ recipe, onUpdateRecipe }) => {
    // State to manage form inputs
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(0);
    const [photoUrl, setPhotoUrl] = useState('');

    const { authState } = useContext(AuthContext);

    useEffect(() => {
        if (recipe) {
            setTitle(recipe.title);
            setType(recipe.type);
            setDescription(recipe.description);
            setDuration(recipe.duration);
            setPhotoUrl(recipe.photoUrl);
        }
    }, [recipe]);

    // Function to handle form submission

    console.log(authState.email);
    console.log(recipe);
    const submitUpdateForm = (e) => {

        e.preventDefault();

        if (authState.email === recipe.userEmail) {
            // Update recipe object with modified attributes
            const updatedRecipe = {
                ...recipe,
                description: description,
                duration: parseInt(duration),
                photoUrl: photoUrl
            };

            // Call parent component callback to update recipe
            onUpdateRecipe(updatedRecipe);
        } else {
            toast.error('You are not authorized to update this recipe.');
        }
    };

    return (
        <>
            <div className="container m-auto box-border h-32">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                <form onSubmit={submitUpdateForm}>
                        <div className='bg-white rounded-xl shadow-md'>
                            <h3 className='text-xl font-bold'> Update Main Part</h3>
                            <div className="flex w-full">
                                <label htmlFor="title" className="text-gray-400 w-36 text-sm">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    readOnly // Add the readOnly attribute to make the input read-only
                                    className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            <div className="flex w-full">
                                <label htmlFor="type" className="text-gray-400 w-36 text-sm">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    value={type}
                                    readOnly // Add the readOnly attribute to make the input read-only
                                    className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>

                            <div className="flex w-full">
                                <label htmlFor="duration" className="text-gray-400 w-36 text-sm">
                                    Cook Duration(min)
                                </label>
                                <input
                                    type="number"
                                    value={duration}
                                    min="0"
                                    max="1440"
                                    onChange={e => setDuration(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"

                                />
                            </div>
                            <div className="flex w-full">
                                <label htmlFor="photoUrl" className="text-gray-400 w-36 text-sm">
                                    PhotoUrl
                                </label>
                                <input
                                    type="text"
                                    value={photoUrl}
                                    maxLength="255"
                                    pattern="(https?:\/\/.*|\.\.\/assets\/img\/.*)\.(jpg|jpeg|png)$"
                                    onChange={e => setPhotoUrl(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            <div className="flex w-full">
                                <label htmlFor="description" className="text-gray-400 w-36 text-sm">
                                    Description
                                </label>
                                <input
                                    type="textarea"
                                    value={description}
                                    maxLength="255"
                                    onChange={e => setDescription(e.target.value)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            Update
                        </button>
                        <Link to="/myrecipes">
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

    );
};

RecipeForm.propTypes = {
    recipe: PropTypes.object.isRequired,
    onUpdateRecipe: PropTypes.func.isRequired
};

export default RecipeForm;