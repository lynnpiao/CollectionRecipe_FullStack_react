const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {validateRecipe, validatePartialRecipe } = require("../middlewares/SchemaMiddleware");


// read all Recipes
const getRecipes = async (req, res) => {
    try {
        const recipes = await prisma.recipe.findMany({
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        })
        if (recipes.length === 0){
            return res.status(404).json({ msg: 'No recipes found' });
        }
        const recipesWithUserEmail = recipes.map(recipe => ({
            ...recipe,
            userEmail: recipe.user ? recipe.user.email : null
        }));

        res.status(200).json(recipesWithUserEmail)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// read one Recipe
const getRecipesById = async (req, res) => {
    const id =req.params.id;
    try {
        const recipes = await prisma.recipe.findMany(
            {
            where:{
                id: parseInt(id),
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        })
        if (recipes.length === 0){
            return res.status(404).json({ msg: 'No recipes found' });
        }
        const recipesWithUserEmail = recipes.map(recipe => ({
            ...recipe,
            userEmail: recipe.user ? recipe.user.email : null
        }));

        res.status(200).json(recipesWithUserEmail)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// read one user Recipes
const getRecipesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const recipes = await prisma.recipe.findMany(
            {
            where:{
                userId: parseInt(userId),
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        })
        if (recipes.length === 0){
            return res.status(404).json({ msg: 'No recipes found' });
        }
        const recipesWithUserEmail = recipes.map(recipe => ({
            ...recipe,
            userEmail: recipe.user ? recipe.user.email : null
        }));

        res.status(200).json(recipesWithUserEmail)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// create recipe
const createRecipe = async (req, res) => {
    const { title, type, description, duration, userId, photoUrl } = req.body

    try {
        // Create the Recipe entry 
        const recipe = await prisma.recipe.create({
            data: {
                title: title,
                type: type,
                description: description || null,
                duration: parseInt(duration) || null,
                userId: userId || null,
                photoUrl: photoUrl || null,
                createdAt: new Date(),
                updatedAt: new Date()
            },
        })
        res.status(201).json({ msg: 'Create Recipe successfully', recipe })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Created failure' });
    }
};



//update 
const updateRecipe = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id, 10);
    const {description, duration, photoUrl} = req.body

    if (isNaN(idInt)) {
        return res.status(400).json({ error: 'Invalid recipeId' });
    }

    try {
        const recipe = await prisma.recipe.update({
            where: {
                    id: idInt,
            },
            data: {
                description: description || null,
                duration: duration || null,
                photoUrl: photoUrl || null,
                updatedAt: new Date()
            },
        })
        res.status(200).json({ msg: 'Recipe updated successfully',recipe })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// delete
const deleteRecipe = async (req, res) => {
    const id = req.params.id;
    const idInt = parseInt(id, 10);
    console.log(idInt);

    if (isNaN(idInt) || idInt <= 0 ) {
        return res.status(400).json({ error: 'Invalid recipeId' });
    }

    try {
        const deleteRecipe = await prisma.recipe.delete({
            where: {
                id: idInt,
            },
        });

        if (!deleteRecipe) {
            // If the recipe with the given ID doesn't exist
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json({ msg: 'Delete Review successfully', deleteRecipe }); 
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

module.exports = {
    getRecipes,
    getRecipesById,
    getRecipesByUser,
    createRecipe:[validateRecipe, createRecipe],
    updateRecipe:[validatePartialRecipe, updateRecipe],
    deleteRecipe
};

