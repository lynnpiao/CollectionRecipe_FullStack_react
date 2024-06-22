const express = require('express');
const ProcedureController = require('../controller/ProcedureController');
const { validateToken } = require("../middlewares/AuthMiddleware");

const {getProceduresByRecipe, createProceduresByRecipe,  updateProcedureByRecipe, deleteProceduresByRecipe}= ProcedureController;


const router = express.Router()

router.get('/api/procedures/:recipeId', getProceduresByRecipe)
router.post('/api/procedures/:recipeId', validateToken, createProceduresByRecipe)
router.put('/api/procedures/:recipeId/:procedureId', validateToken, updateProcedureByRecipe)
router.delete('/api/procedures/:recipeId',  validateToken, deleteProceduresByRecipe)

module.exports = router;