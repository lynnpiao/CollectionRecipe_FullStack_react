import { useLoaderData, useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../utils/AuthContext';
import axios from 'axios';


const AddRecipeProcedures = () => {

    let { id } = useParams();
    const procedures = useLoaderData();
    const initialProcedures = [];
    if (procedures && procedures.length > 0) {
        for (let i = procedures.length + 1; i <= 5; i++) {
            initialProcedures.push({ procedureId: i, description: '' });
        }
    } else {
        for (let i = 1; i <= 5; i++) {
            initialProcedures.push({ procedureId: i, description: '' });
        }
    }
    const [addProcedures, setAddProcedures] = useState(initialProcedures);
    const { authState } = useContext(AuthContext);
    const [recipeUserId, setRecipeUserId] = useState(null);
    const navigate = useNavigate();

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
        fetchRecipeUserId();
    }, [])


    const submitAddForm = () => {
        const newProcedures = addProcedures.filter(procedure => procedure.description !== null && procedure.description !== '');

        if (newProcedures.length > 0) {
            axios.post(`http://localhost:8000/api/procedures/${id}`, { procedures: newProcedures }, {
                headers: {
                    accessToken: localStorage.getItem('accessToken')
                }
            })
                .then(proceduresResponse => {
                    const createdProcedures = proceduresResponse.data;
                    console.log('Procedures created:', createdProcedures);
                    navigate(`/procedures/${id}`);
                })
                .catch(error => {
                    console.error(`Error adding procedures for the recipe of ${recipeId}`, error);
                    toast.error(`Failed to add procedures for the recipe of ${recipeId}. Please try again.`);
                });
        } else {
            console.log('No procedures added in recipe');
        }


    }

    return (
        <>
            <div className="container m-auto box-border h-32">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <h3 className='text-xl font-bold'> Add Recipe Procedures</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (authState.id === recipeUserId) {
                            submitAddForm();
                        } else {
                            toast.error('You are not authorized to add ingredients to this recipe.');
                        }
                    }}>
                        {addProcedures.map(procedure => (
                            <div className="flex w-full" key={procedure.procedureId}>
                                <label htmlFor={`desc${procedure.procedureId}`} className="text-gray-400 w-36 text-sm">
                                {procedure.procedureId !== 5 ? `Step ${procedure.procedureId}` : 'Others'}
                                </label>
                                <input
                                    type="text"
                                    value={procedure.description}
                                    onChange={(e) => {
                                        const newDescription = e.target.value;
                                        setAddProcedures(prevProcedures => prevProcedures.map(p =>
                                            p.procedureId === procedure.procedureId ? { ...p, description: newDescription } : p
                                        ));
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder=""
                                />
                            </div>))
                        }
                        <button
                            type="submit"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            Add
                        </button>
                        <Link to={`/procedures/${id}`}>
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

export default AddRecipeProcedures