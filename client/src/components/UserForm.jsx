import { useState } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";


const UserForm = ({ UserSubmit, UserFormType }) => {
    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');

    const submitForm = async(e) => {
        e.preventDefault();

        const newUser = {
            email,
            password
        };

        try {
            await UserSubmit(newUser);
            console.log("UserForm Submit Successfully");
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <div className="container m-auto w-80 box-border h-32">
            <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                <form onSubmit={submitForm}>
                    <div className='mb-6'>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your Email"
                            required
                        />
                    </div>
                    <div className='mb-6'>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassWord(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Your Password..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                        {UserFormType}
                    </button>
                    <Link to="/">
                        <button
                            type="button"
                            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            Cancel
                        </button>
                    </Link>
                </form>
            </div>
        </div>
    )
}

UserForm.propTypes = {
    UserFormType: PropTypes.string.isRequired,
    UserSubmit: PropTypes.func.isRequired
};

export default UserForm