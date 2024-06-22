const express = require('express');
const ReviewController = require('../controller/ReviewController');
const { validateToken } = require("../middlewares/AuthMiddleware");

const {getReviewsByRecipe, createReviewByRecipe, updateReviewByRecipe, deleteReviewByRecipe} = ReviewController;

const router = express.Router()


router.get('/api/reviews/:recipeId', getReviewsByRecipe)
router.post('/api/reviews/:recipeId', createReviewByRecipe)
router.put('/api/reviews/:recipeId/:id', updateReviewByRecipe)
router.delete('/api/reviews/:recipeId/:id',  deleteReviewByRecipe)

module.exports = router;