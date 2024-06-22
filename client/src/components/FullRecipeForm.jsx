import { useState, useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { AuthContext } from "../utils/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";


const FullRecipeForm = ({ RecipeSubmit }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(0);
    const [photoUrl, setPhotoUrl] = useState('');
    const [desc1, setDesc1] = useState('');
    const [desc2, setDesc2] = useState('');
    const [desc3, setDesc3] = useState('');
    const [desc4, setDesc4] = useState('');
    const [desc5, setDesc5] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const { authState } = useContext(AuthContext);

    let userId = authState.id;


    const fetchIngredientsList = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/ingredients');
            const data = await response.data;
            setIngredients(data);
        } catch (error) {
            console.error("There was an error fetching ingredients!", error);
            toast.error('Failed to fetch ingredients');
        }
    };

    useEffect(() => {
        fetchIngredientsList();
    }, []);

    // Calculate midpoint
    const midpoint = Math.ceil(ingredients.length / 2);

    // Split into two halves
    const firstHalf = ingredients.slice(0, midpoint);
    const secondHalf = ingredients.slice(midpoint);


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

    const submitCreateForm = async (e) => {
        e.preventDefault();

        const newRecipe = {
            title,
            type,
            description,
            duration,
            photoUrl,
            userId
        };

        const descriptions = [desc1, desc2, desc3, desc4, desc5];
        const newProcedures = descriptions.map((description, index) => ({ procedureId: index + 1, description })).filter(procedure => procedure.description !== null && procedure.description !== '');

        // const newIngredients = selectedIngredients;

        try {
            await RecipeSubmit({ newRecipe, newProcedures, selectedIngredients });
            console.log("RecipeForm Submit Successfully");
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <>
          
                <div className="container m-auto box-border h-32">
                    <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                        <form onSubmit={submitCreateForm} >
                            <div className='bg-white rounded-xl shadow-md'>
                                <h3 className="text-3xl font-bold text-gray-300">01</h3>
                                <h3 className='text-xl font-bold'> Main Part</h3>
                                <div className="flex w-full">
                                    <label htmlFor="title" className="text-gray-400 w-36 text-sm">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        maxLength="100"
                                        onChange={e => setTitle(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Cuisine Title"
                                        required
                                    />
                                </div>
                                <div className="flex w-full">
                                    <label htmlFor="type" className="text-gray-400 w-36 text-sm">
                                        Type
                                    </label>
                                    <input
                                        type="text"
                                        id="type"
                                        value={type}
                                        maxLength="100"
                                        onChange={e => setType(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Cuisine Type"
                                        required
                                    />
                                </div>

                                <div className="flex w-full">
                                    <label htmlFor="duration" className="text-gray-400 w-36 text-sm">
                                        Cook Duration(min)
                                    </label>
                                    <input
                                        type="number"
                                        id="duration"
                                        value={duration}
                                        min="0"
                                        max="1440"
                                        onChange={e => setDuration(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Cook Duration"
                                    />
                                </div>
                                <div className="flex w-full">
                                    <label htmlFor="photoUrl" className="text-gray-400 w-36 text-sm">
                                        PhotoUrl
                                    </label>
                                    <input
                                        type="text"
                                        id="photoUrl"
                                        value={photoUrl}
                                        maxLength="255"
                                        pattern="(https?:\/\/.*|\.\.\/assets\/img\/.*)\.(jpg|jpeg|png)$"
                                        onChange={e => setPhotoUrl(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="PhotoUrl"
                                    />
                                </div>
                                <div className="flex w-full">
                                    <label htmlFor="description" className="text-gray-400 w-36 text-sm">
                                        Description
                                    </label>
                                    <input
                                        type="textarea"
                                        id="description"
                                        value={description}
                                        maxLength="255"
                                        onChange={e => setDescription(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Description"
                                    />
                                </div>
                            </div>

                            <div className='bg-white rounded-xl shadow-md'>
                                <h3 className="text-3xl font-bold text-gray-300">02</h3>
                                <h3 className='text-xl font-bold'> Recipe Procedures</h3>
                                <div className="flex w-full">
                                    <label htmlFor="desc1" className="text-gray-400 w-36 text-sm">
                                        Step 1
                                    </label>
                                    <input
                                        type="textarea"
                                        id="desc1"
                                        value={desc1}
                                        onChange={e => setDesc1(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder=""
                                    />
                                </div>
                                <div className="flex w-full">
                                    <label htmlFor="desc2" className="text-gray-400 w-36 text-sm">
                                        Step 2
                                    </label>
                                    <input
                                        type="textarea"
                                        id="desc2"
                                        value={desc2}
                                        onChange={e => setDesc2(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder=""
                                    />
                                </div>
                                <div className="flex w-full">
                                    <label htmlFor="desc3" className="text-gray-400 w-36 text-sm">
                                        Step 3
                                    </label>
                                    <input
                                        type="textarea"
                                        id="desc3"
                                        value={desc3}
                                        onChange={e => setDesc3(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder=""
                                    />
                                </div>

                                <div className="flex w-full">
                                    <label htmlFor="desc4" className="text-gray-400 w-36 text-sm">
                                        Step 4
                                    </label>
                                    <input
                                        type="textarea"
                                        id="desc4"
                                        value={desc4}
                                        onChange={e => setDesc4(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder=""
                                    />
                                </div>

                                <div className="flex w-full">
                                    <label htmlFor="desc5" className="text-gray-400 w-36 text-sm">
                                        Others
                                    </label>
                                    <input
                                        type="textarea"
                                        id="desc5"
                                        value={desc5}
                                        onChange={e => setDesc5(e.target.value)}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder=""
                                    />
                                </div>


                            </div>

                            <div className='bg-white rounded-xl shadow-md'>
                                <h3 className="text-3xl font-bold text-gray-300">03</h3>
                                <h3 className='text-xl font-bold'> Recipe Ingredients</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* <div className="left"> */}
                                    <ul>
                                        {firstHalf.map(ingredient => (
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
                                    {/* </div> */}
                                    {/* <div className="right"> */}
                                    <ul>
                                        {secondHalf.map(ingredient => (
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
                                    {/* </div> */}
                                    <p>Selected ingredients: {selectedIngredients.map(item => item.id || item.id).join(', ')}</p>
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                Submit
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
    )
}

FullRecipeForm.propTypes = {
    RecipeSubmit: PropTypes.func.isRequired

};

export default FullRecipeForm