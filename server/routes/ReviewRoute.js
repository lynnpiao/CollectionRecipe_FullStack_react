const express = require('express');
const ReviewController = require('../controller/ReviewController');
const { validateToken } = require("../middlewares/AuthMiddleware");

const {getReviewsByRecipe, createReviewByRecipe, deleteReviewByRecipe} = ReviewController;

const router = express.Router()


router.get('/api/reviews/:recipeId', getReviewsByRecipe)
router.post('/api/reviews', validateToken, createReviewByRecipe)
router.delete('/api/reviews/:id',  validateToken, deleteReviewByRecipe)

module.exports = router;