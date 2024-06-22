
import { Link, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../utils/AuthContext";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PropTypes from "prop-types";

const RecipeCard = ({ recipe, onDelete, isHome }) => {
    const { authState } = useContext(AuthContext);
    const [showFullDescription, setShowFullDescription] = useState(false);
   
    const navigate = useNavigate();

    const handleDeleteClick = () => {
        onDelete(recipe.id);
      };

    let description = recipe.description;
    if (!showFullDescription) {
        description = description.substring(0, 80) + '...';
    }

    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (recipe.userEmail) {
            const emailParts = recipe.userEmail.split('@');
            setUserName(emailParts[0]);
        }
    }, [recipe.userEmail]);

    return (
        <div className='bg-white rounded-xl shadow-md w-70'>
            <div className='p-4'>
                <div className='mb-4'>
                    <h3 className='text-xl font-bold' onClick={() => {
                        navigate(`/reviews/${recipe.id}`);
                    }} >{recipe.title}</h3>

                    {authState.email === recipe.userEmail  && !isHome &&
                    <div className="flex space-x-4">
                        <Link to={`/editrecipes/${recipe.id}`}>
                            <button
                                type="button"
                                className='text-indigo-500 mb-5 hover:text-indigo-600 text-md font-bold'>
                                <FaRegEdit />
                            </button>
                        </Link>
                        <button
                            onClick={handleDeleteClick}
                            className='text-indigo-500 mb-5 hover:text-indigo-600 text-md font-bold'
                        >  <MdDelete />
                        </button>
                       
                    </div>}

                    <div className='text-gray-600'  >
                        <span>{recipe.type}</span><span>(cook time: {recipe.duration} min)</span>
                    </div>

                </div>

                {/* <div className='mb-5'>{description}</div>

                <button
                    onClick={() => setShowFullDescription((prevState) => !prevState)}
                    className='text-indigo-500 mb-5 hover:text-indigo-600'
                >
                    {showFullDescription ? 'Less' : 'More'}
                </button> */}

                <div className='border border-gray-100 mb-5'></div>

                {recipe.photoUrl ?
                <div className='bg-white rounded-xl shadow-md'>
                <img src={recipe.photoUrl} alt='recipe pic' className="w-25 h-auto rounded-xl" style={{ maxWidth: '100%', height: 'auto' }}/> 
                </div>:
                <div className="mb-2">
                <div className='mb-5'>{description}</div>
                <button
                    onClick={() => setShowFullDescription((prevState) => !prevState)}
                    className='text-indigo-500 mb-5 hover:text-indigo-600'
                >
                    {showFullDescription ? 'Less' : 'More'}
                </button>
                </div>
                }
                <div className='flex space-x-4 '>
                    <div className='text-gray-600 my-2 text-left'>User: {userName} </div>
                    <div className='text-gray-600 my-2 text-right'>Update At: {dayjs(recipe.updatedAt).format('YYYY-MM-DD')}</div>
                </div>
                <div className="flex space-x-4">
                    <Link
                        to={`/ingredients/${recipe.id}`}
                        className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm'
                    >
                        More Ingredients
                    </Link>

                    <Link
                        to={`/procedures/${recipe.id}`}
                        className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm'
                    >
                        More Procedures
                    </Link>
                </div>

            </div>
        </div>
    );
};

RecipeCard.propTypes = {
    recipe: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    isHome: PropTypes.bool.isRequired
};


export default RecipeCard