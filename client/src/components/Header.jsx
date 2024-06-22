import { NavLink, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { AuthContext } from '../utils/AuthContext';


const Header = () => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { authState, setAuthState } = useContext(AuthContext);

    const handleClick = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    const linkState = ({ isActive }) =>
        isActive
            ? 'bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2'
            : 'text-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2';

    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate('/login');
    }

    const navigateToSign = () => {
        navigate('/register');
    }

    const SingOutAndNagivateToHome =()=>{
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("accessToken");
            setAuthState({ email: "", id: 0, status: false });
            navigate('/');
        }
    }

    return (
        <header className='flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50'>
            <div className='flex flex-wrap items-center justify-between gap-5 w-full'>
                <p className="text-4xl font-medium">
                    Recipe Collection
                </p>

                <div className={`${isMenuVisible ? 'block' : 'hidden'} lg:block lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50`}>
                    <button onClick={handleClick} className='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3'>
                    <IoMdClose size='30px'/>
                    </button>
                    <ul
                        className='lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
                        <li className='max-lg:border-b border-gray-300 max-lg:py-3 px-3'>
                            <NavLink to='/' className={linkState}>
                                Home
                            </NavLink>
                        </li>
                        
                        <li className='max-lg:border-b border-gray-300 max-lg:py-3 px-3'>
                            {authState.status &&
                            <NavLink to='/myrecipes' className={linkState}>
                                My Recipes
                            </NavLink>}
                        </li>
                        <li className='max-lg:border-b border-gray-300 max-lg:py-3 px-3'>
                            {authState.status &&
                            <NavLink to='/createrecipe' className={linkState}>
                                Add New Recipe
                            </NavLink>}
                        </li>
                        

                    </ul>
                </div>

                <div className='flex max-lg:ml-auto space-x-3'>

                { !authState.status ? 
                ( <>
                    <button onClick={navigateToLogin}
                        className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Login</button>
                    <button onClick={navigateToSign}
                        className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Sign
                        up</button>
                </>):(
                    <>
                    <button onClick={SingOutAndNagivateToHome}
                        className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Logout</button>
                    </>
                )

}
                    <button onClick={handleClick} className='lg:hidden'>
                        <IoMdMenu size='30px'/>
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header