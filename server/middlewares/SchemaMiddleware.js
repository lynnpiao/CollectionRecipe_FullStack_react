const Joi = require('joi');

//Validation For create User
// Joi validation schema 
const userSchema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().required(),
});

// Middleware for validating request data
const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


//Validation For create Recipe
// Joi validation schema 
const recipeSchema = Joi.object({
    title: Joi.string().max(100).required(),
    type: Joi.string().max(100).required(),
    description: Joi.string().max(255).allow(null, ''),
    duration: Joi.number().integer().positive().max(1440).allow(null),
    userId: Joi.number().integer().allow(null),
    photoUrl: Joi.string().max(255).pattern(/^(https?:\/\/|\.\.\/assets\/img\/).*\.(jpg|jpeg|png)$/).allow(null, '')
});

// Middleware for validating request data
const validateRecipe = (req, res, next) => {
    const { error } = recipeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


// Validation For Update Recipe
// Joi validation schema 
const partialRecipeSchema = Joi.object({
    description: Joi.string().max(255).allow(null, ''),
    duration: Joi.number().integer().positive().max(1440).allow(null),
    photoUrl: Joi.string().max(255).pattern(/^(https?:\/\/|\.\.\/assets\/img\/).*\.(jpg|jpeg|png)$/).allow(null, '')
});

// Middleware for validating request data
const validatePartialRecipe = (req, res, next) => {
    const { error } = partialRecipeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}

// Validation For create Ingredient 
// Joi validation schema 
const ingredientSchema = Joi.object({
    name: Joi.string().max(100).required(),
    category: Joi.string()
});

// Middleware for validating request data
const validateIngredient = (req, res, next) => {
    const { error } = ingredientSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}



// Validation For create Ingredients in recipe
// Joi validation schema 
const ingredientRecipeSchema = Joi.object({
    ingredients: Joi.array().items(
        Joi.object({
            id: Joi.number().integer().required(),
            amount: Joi.string().required()
        })
      ).required()
  });

// Middleware for validating request data
const validateIngredientRecipe = (req, res, next) => {
    const { ingredients } = req.body;
    const { error } = ingredientRecipeSchema.validate({ ingredients });
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


// Validation For Update IngredientRecipe 
// Joi validation schema 
const partialIngredientRecipeSchema = Joi.object({
    amount: Joi.string().required()
});

// Middleware for validating request data
const validatePartialIngredientRecipe = (req, res, next) => {
    const { error } = partialIngredientRecipeSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


// Validation For create Procedures in recipe
// Joi validation schema 
const procedureSchema = Joi.object({
    procedures: Joi.array().items(
        Joi.object({
            procedureId: Joi.number().integer().required(),
            description: Joi.string().required()
        })
      ).required()
  });

// Middleware for validating request data
const validateProcedure = (req, res, next) => {
    const { procedures } = req.body;
    const { error } = procedureSchema.validate({ procedures });
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


// Validation For Update Procedure 
// Joi validation schema 
const partialProcedureSchema = Joi.object({
    description: Joi.string().required()
});

// Middleware for validating request data
const validatePartialProcedure = (req, res, next) => {
    const { error } = partialProcedureSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}

//Validation For create Review
// Joi validation schema 
const reviewSchema = Joi.object({
    recipeId: Joi.number().integer().required(),
    userId: Joi.number().integer().allow(null),
    comment: Joi.string().required()
});

// Middleware for validating request data
const validateReview = (req, res, next) => {
    const { error } = reviewSchema .validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


// Validation For Update Review
// Joi validation schema 
const partialReviewSchema = Joi.object({
    comment: Joi.string().required()
});

// Middleware for validating request data
const validatePartialReview = (req, res, next) => {
    const { error } = partialReviewSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    next();
}


module.exports = { 
    validateUser,
    validateRecipe,
    validatePartialRecipe,
    validateIngredient,
    validateIngredientRecipe,
    validatePartialIngredientRecipe,
    validateProcedure,
    validatePartialProcedure,
    validateReview,
    validatePartialReview
};