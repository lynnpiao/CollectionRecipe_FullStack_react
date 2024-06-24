const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validateReview, validatePartialReview } = require("../middlewares/SchemaMiddleware");


// read all Reviews for one recipe
const getReviewsByRecipe = async (req, res) => {
    const { recipeId } = req.params;

    const recipeIdInt = parseInt(recipeId, 10);

    if (isNaN(recipeIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId' });
    }
    try {
        const reviews = await prisma.review.findMany({
            where: {
                recipeId: recipeIdInt,
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });

        if (reviews.length === 0) {
            return res.status(404).json({ msg: 'No reviews found for this recipe' });
        }
        const reviewsWithUserEmail = reviews.map(review => ({
            ...review,
            userEmail: review.user ? review.user.email : null
        }));
        res.status(200).json(reviewsWithUserEmail);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}



// create reviews for one recipe
const createReviewByRecipe = async (req, res) => {
    const { comment, userId, recipeId} = req.body;

    if (!comment && !recipeId){
        return res.status(400).json({ error: 'Comment or RecipeId is required' });
    }

    try {
        // Create the Review entry 
        const review = await prisma.review.create({
            data: {
                recipeId: parseInt(recipeId),
                userId: userId ? parseInt(userId) : null,
                comment: comment
            },
        })
        res.status(201).json({ msg: 'Create Review successfully', review })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Created failure' });
    }
};


// delete Procedures in recipe
const deleteReviewByRecipe = async (req, res) => {
    const { id } = req.params;

    const idInt = parseInt(id, 10);

    if (isNaN(idInt)) {
        return res.status(400).json({ error: 'Invalid recipeId or reviewId' });
    }

    try {
        // Delete the ProcedureRecipe entries
        const deleteReview = await prisma.review.delete({
            where: {
                id: idInt,
            },
        });

        if (deleteReview.count === 0) {
            return res.status(404).json({ error: 'No Review found to delete' });
        }
        res.status(200).json({ msg: 'Delete Review successfully', deleteReview });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}



module.exports = {
    getReviewsByRecipe,
    createReviewByRecipe:[validateReview, createReviewByRecipe],  // Apply schema validation middleware
    deleteReviewByRecipe
};

