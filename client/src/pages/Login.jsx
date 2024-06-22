import UserForm from "../components/UserForm";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from "../utils/AuthContext";
import axios from "axios";


const Login = () => {
    const navigate = useNavigate();

    const { setAuthState } = useContext(AuthContext);

    // Login User
    const loginUser = async (loginUser) => {

        try {
            const response = await axios.post('http://localhost:8000/api/user/login', loginUser, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.data;
        localStorage.setItem("accessToken", data.token);
        setAuthState({
            email: data.email,
            id: data.id,
            status: true,
        });
        toast.success('Login successfully');
        navigate("/");

        } catch (error) {
            console.error('Error login:', error); // Log the error for debugging
            toast.error('Failed to login account. Please try again.'); // Display error toast notification
        }

    };

    return (
        <>
            <UserForm UserSubmit={loginUser} UserFormType="Login" />
        </>
    );
};

export default Login;