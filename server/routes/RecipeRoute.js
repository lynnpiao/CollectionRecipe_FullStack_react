const express = require('express');
const RecipeController = require('../controller/RecipeController');
const { validateToken } = require("../middlewares/AuthMiddleware");

const { getRecipes, getRecipesById, getRecipesByUser, createRecipe, updateRecipe, deleteRecipe } = RecipeController;

const router = express.Router()


router.get('/api/recipes', getRecipes)
router.get('/api/recipes/ById/:id', getRecipesById)
router.get('/api/recipes/:userId', validateToken, getRecipesByUser)
router.post('/api/recipes', validateToken, createRecipe)
router.put('/api/recipes/:id',validateToken, updateRecipe)
router.delete('/api/recipes/:id', validateToken, deleteRecipe)

module.exports = router;