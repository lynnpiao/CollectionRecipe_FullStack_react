const express = require('express');
const IngredientController = require('../controller/IngredientController');
const { validateToken } = require("../middlewares/AuthMiddleware");

const getIngredients = IngredientController.getIngredients;
const createIngredient = IngredientController.createIngredient;
const deleteIngredient = IngredientController.deleteIngredient;
const getIngredientsByRecipe = IngredientController.getIngredientsByRecipe;
const createIngredientsByRecipe = IngredientController.createIngredientsByRecipe;
const updateIngredientAmountByRecipe = IngredientController.updateIngredientAmountByRecipe;
const deleteIngredientByRecipe = IngredientController.deleteIngredientByRecipe;

const router = express.Router()

// ingredients table is managed by myself
router.get('/api/ingredients', getIngredients)
router.post('/api/ingredients', createIngredient)
router.delete('/api/ingredients/:id', deleteIngredient)
// ingredient-recipe can be managed by user
router.get('/api/ingredients/:recipeId', getIngredientsByRecipe)
router.post('/api/ingredients/:recipeId', validateToken, createIngredientsByRecipe)
router.put('/api/ingredients/:recipeId/:ingredientId', validateToken, updateIngredientAmountByRecipe)
router.delete('/api/ingredients/:recipeId/:ingredientId',  validateToken, deleteIngredientByRecipe)

module.exports = router;