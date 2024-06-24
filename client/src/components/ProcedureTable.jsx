import { Link, useParams } from 'react-router-dom'
import { AuthContext } from "../utils/AuthContext";
import { useEffect, useState, useContext } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

const ProcedureTable = () => {
  
  const [procedures, setProcedures] = useState([]);
  const [recipe, setRecipe] = useState({})
  const [recipeUserId, setRecipeUserId] = useState(null);
  let { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [description, setDescription] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  

  const fetchProcedures = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/procedures/${id}`);
      console.log(response.data.procedures);
      setProcedures(response.data.procedures);
    } catch (error) {
      console.error('Error fetching procedures:', error);
      toast.error('Failed to fetch procedures');
    }
  };
  

  const fetchRecipeUserId = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/recipes/ById/${id}`);
      // console.log(response.data[0]);
      setRecipe(response.data[0]);
      setRecipeUserId(response.data[0].userId);

    } catch (error) {
      console.error('Error fetching recipe:', error);
      toast.error('Failed to fetch recipe');
    }
  };

  useEffect(() => {
    fetchProcedures();
    fetchRecipeUserId();
  }, [id]); // Fetch data when id changes


  const deleteProcedure = async (procedureId) => {

    const confirmDelete = window.confirm('Are you sure you want to delete this procedure?');

    if (!confirmDelete) {
      return; // If user cancels, exit the function
    }
  
    try {
      const response = await axios.delete(`http://localhost:8000/api/procedures/${id}/${procedureId}`,
      {
        headers: { accessToken: localStorage.getItem('accessToken') },
      });

      // After deletion, refetch procedures
      await fetchProcedures(); // Assuming fetchProcedures updates state
      toast.success('Deleted successfully');
    } catch (error) {
      console.error('Error deleting procedure:', error);
      toast.error('Failed to delete procedure');
    }
  };


  const openModal = (procedure) => {
    setSelectedProcedure(procedure);
    setDescription(procedure.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProcedure(null);
  };

  const handleUpdate = async () => {
    if (!selectedProcedure) return;

    try {
      await axios.put(`http://localhost:8000/api/procedures/${recipe.id}/${selectedProcedure.procedureId}`,
        { description },
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        }
      );
      toast.success('Procedure updated successfully');
      closeModal();
      fetchProcedures(); // Refetch procedures after update
    } catch (error) {
      console.error('Error updating procedure:', error);
      toast.error('Failed to update procedure. Please try again.');
    }
  };

  return (
    <div className="flex flex-col my-10">
      <div className="w-full">
        <h3 className='text-xl font-bold'>Recipe Title: {recipe.title}</h3>
        <div className='border border-gray-100 mb-5'></div>

        {authState.id === recipeUserId &&
          <Link to={`/addprocedures/${id}`} className="ml-4 sm:ml-0">
            <button
              type="button"
              className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              Add New Procedures
            </button>
          </Link>}

        <div className="mt-5 overflow-x-auto relative shadow sm:rounded-lg border">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b">
              <tr>
                <th scope="col" className="py-3 px-6">
                  #
                </th>
                <th scope="col" className="py-3 px-6">
                  Description
                </th>
                <th scope="col" className="py-3 px-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {procedures.length !== 0 ? (
                procedures.map((procedure, index) => (
                  <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700" key={index}>
                    <td className="py-4 px-6">{procedure.procedureId}</td>
                    <td className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">{procedure.description}</td>
                    <td className="py-4 px-6">
                      {authState.id === recipeUserId &&
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => openModal(procedure)}
                            className="mr-2 py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <FaRegEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => {deleteProcedure(procedure.procedureId) }}
                            className="mr-2 py-2 px-3 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                            <MdDelete />
                          </button>
                        </div>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                  <td colSpan="4" className="py-4 px-6 text-center">
                    Data Not Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Edit Procedure Description</h2>
          <form onSubmit={(e) => { if(authState.id === recipeUserId){e.preventDefault(); handleUpdate();} }}>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">Description</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="mr-2 py-2 px-4 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>)
}

const proceduresLoader = async ({ params }) => {
  try {
    const response = await axios.get(`http://localhost:8000/api/procedures/${params.id}`);
    return response.data.procedures;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // or return an appropriate error message or status
    }
    throw error; // rethrow other errors to be handled globally or by the component
  }
};


export {ProcedureTable as default, proceduresLoader}