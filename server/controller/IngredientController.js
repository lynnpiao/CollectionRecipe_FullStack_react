const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {validateIngredient, validateIngredientRecipe, validatePartialIngredientRecipe} = require("../middlewares/SchemaMiddleware");



// read all ingredients
const getIngredients = async (req, res) => {
    try {
        const ingredients = await prisma.ingredient.findMany()

        if (ingredients.length === 0){
            return res.status(404).json({ msg: 'No ingredients found' });
        }
        res.status(200).json(ingredients)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// create ingredient
const createIngredient = async (req, res) => {
    const { name, category } = req.body

    try {
        const ingredient = await prisma.ingredient.create({
            data: {
                name: name,
                category: category || null
            },
        })
        res.status(201).json({ msg: 'Create Ingredient successfully', ingredient })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

// delete
const deleteIngredient = async (req, res) => {
    try {
        const ingredient = await prisma.ingredient.delete({
            where: {
                id: parseInt(req.params.id),
            },
        })
        res.status(200).json({ msg: 'Delete Ingredient successfully', ingredient });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// read ingredients in recipe
const getIngredientsByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    const recipeIdInt = parseInt(recipeId, 10);
     
    if (isNaN(recipeIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId' });
      }

    try {
        const ingredients = await prisma.ingredientRecipe.findMany({
            where: {
                recipeId: recipeIdInt,
            },
            include: {
                ingredient: true,
            },
        });

        if (ingredients.length === 0) {
            return res.status(404).json({ msg: 'No ingredients found for this recipe' });
        }

        res.status(200).json(ingredients.map(ir => ({
            id: ir.ingredient.id,
            name: ir.ingredient.name,
            category: ir.ingredient.category,
            amount: ir.amount,
        })));
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// create ingredients in one recipe
const createIngredientsByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    const { ingredients } = req.body;
    
    console.log(recipeId);
    console.log(ingredients);

    const recipeIdInt = parseInt(recipeId, 10);

    if (isNaN(recipeIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId' });
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Ingredients must be an array with at least one item' });
    }

    try {
        // Create the IngredientRecipe entries
        const ingredientRecipes = await prisma.ingredientRecipe.createMany({
            data: ingredients.map(ingredient => ({
                recipeId: recipeIdInt,
                ingredientId: ingredient.id,
                amount: ingredient.amount,
            })),
        });

        res.status(201).json({ msg: 'Ingredients added to recipe successfully', ingredientRecipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Created failure' });
    }
};

//update 
const updateIngredientAmountByRecipe = async (req, res) => {
    const { recipeId, ingredientId } = req.params;
    const { amount } = req.body

    const recipeIdInt = parseInt(recipeId, 10);
    const ingredientIdInt = parseInt(ingredientId, 10);

    if (!amount) {
        return res.status(400).json({ error: 'Amount is required' });
      }

    if (isNaN(recipeIdInt) || isNaN(ingredientIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId or ingredientId' });
      }

    try {
        const ingredientRecipe = await prisma.ingredientRecipe.update({
            where: {
                ingredientId_recipeId: {
                    recipeId: recipeIdInt,
                    ingredientId: ingredientIdInt,
                  },
            },
            data: {
                amount: amount
            },
        })
        res.status(200).json({ msg: 'Amount updated successfully', ingredientRecipe})
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// delete ingredient in recipe
const deleteIngredientByRecipe = async (req, res) => {
    const { recipeId, ingredientId } = req.params;

    const recipeIdInt = parseInt(recipeId, 10);
    const ingredientIdInt = parseInt(ingredientId, 10);

    if (isNaN(recipeIdInt) || isNaN(ingredientIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId or ingredientId' });
      }
    

    try {
        const ingredientRecipe = await prisma.ingredientRecipe.delete({
            where: {
                ingredientId_recipeId: {
                    recipeId: recipeIdInt,
                    ingredientId: ingredientIdInt,
                  },
            },
        })
        res.status(200).json({ msg: 'Delete ingredient in recipe successfully',ingredientRecipe});
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}



module.exports = {
    getIngredients,
    createIngredient:[validateIngredient, createIngredient],
    deleteIngredient,
    getIngredientsByRecipe,
    createIngredientsByRecipe:[validateIngredientRecipe, createIngredientsByRecipe],
    updateIngredientAmountByRecipe:[validatePartialIngredientRecipe, updateIngredientAmountByRecipe],
    deleteIngredientByRecipe
};
