import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import { AuthContext } from "./utils/AuthContext";
import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MyRecipes from './pages/MyRecipes';
import AddRecipe from './pages/AddRecipe';
import EditRecipe, {recipeLoader}from './pages/EditRecipe';
import RecipeIngredients, {ingredientsLoader} from './pages/RecipeIngredients';
import RecipeProcedures, {proceduresLoader} from './pages/RecipeProcedures';
import AddRecipeIngredients  from './pages/AddRecipeIngredients';
import AddRecipeProcedures from './pages/AddRecipeProcedures';
import Register from './pages/Register';
import Login from './pages/Login';
import PageNotFound from "./pages/PageNotFound";
import axios from 'axios';



const App = () => {

  const [authState, setAuthState] = useState({
    email: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/user/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            email: response.data.email,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);
  

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ email: "", id: 0, status: false });
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/myrecipes" element={<MyRecipes />} />
        <Route path="/createrecipe" element={<AddRecipe />} />
        <Route path="/editrecipes/:id" element={<EditRecipe />} />
        <Route path="/ingredients/:id" element={<RecipeIngredients />} />
        <Route path="/procedures/:id" element={<RecipeProcedures />} />
        <Route path="/addingredients/:id" element={<AddRecipeIngredients />} 
        loader={ingredientsLoader}/>
        <Route path="/addprocedures/:id" element={<AddRecipeProcedures />} 
        loader={proceduresLoader}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='*' element={<PageNotFound />} />
      </Route>
    )
  );

  return ( <div className="App">
  <AuthContext.Provider value={{ authState, setAuthState }}>
    <RouterProvider router={router} />
    </AuthContext.Provider>
  </div>);
}

export default App