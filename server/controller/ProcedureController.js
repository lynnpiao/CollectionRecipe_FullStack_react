const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const {validateProcedure, validatePartialProcedure} = require("../middlewares/SchemaMiddleware");



// read all Procedures for one recipe
const getProceduresByRecipe = async (req, res) => {
    const { recipeId } = req.params;

    const recipeIdInt = parseInt(recipeId, 10);

    if (isNaN(recipeIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId' });
    }
    try {
        const procedures = await prisma.procedureRecipe.findMany({
            where: {
                recipeId: recipeIdInt,
            }
        });

        if (procedures.length === 0) {
            return res.status(404).json({ msg: 'No procedures found for this recipe' });
        }
        res.status(200).json({ msg: 'Successfully get all procedures for one recipe', procedures });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}


// create Procedures in one recipe
const createProceduresByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    const { procedures } = req.body;

    console.log(recipeId);
    console.log(procedures);

    const recipeIdInt = parseInt(recipeId, 10);

    if (isNaN(recipeIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId' });
    }

    if (!Array.isArray(procedures) || procedures.length === 0) {
        return res.status(400).json({ error: 'Procedures must be an array with at least one item' });
    }

    try {
        // Create the ProcedureRecipe entries
        const procedureRecipes = await prisma.procedureRecipe.createMany({
            data: procedures.map(procedure => ({
                recipeId: recipeIdInt,
                procedureId: procedure.procedureId,
                description: procedure.description,
            })),
        });

        res.status(201).json({ msg: 'Procedures added to recipe successfully', procedureRecipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Created failure' });
    }
};



//update 
const updateProcedureByRecipe = async (req, res) => {
    const { recipeId, procedureId } = req.params;
    const { description } = req.body

    const recipeIdInt = parseInt(recipeId, 10);
    const procedureIdInt = parseInt(procedureId, 10);

    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }

    if (isNaN(recipeIdInt) || isNaN(procedureIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId or ingredientId' });
    }

    try {
        const procedureRecipe = await prisma.procedureRecipe.update({
            where: {
                procedureId_recipeId: {
                    recipeId: recipeIdInt,
                    procedureId: procedureIdInt,
                },
            },
            data: {
                description: description
            },
        })
        res.status(200).json({ msg: 'Procedure updated successfully', procedureRecipe })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

// delete Procedures in recipe
const deleteProceduresByRecipe = async (req, res) => {
    const { recipeId } = req.params;
    const { procedureIds } = req.body;

    const recipeIdInt = parseInt(recipeId, 10);

    if (isNaN(recipeIdInt)) {
        return res.status(400).json({ error: 'Invalid recipeId' });
    }

    if (!Array.isArray(procedureIds) || procedureIds.length === 0) {
        return res.status(400).json({ error: 'ProcedureIds must be an array with at least one item' });
    }

    try {
        // Delete the ProcedureRecipe entries
        const deleteProcedures = await prisma.procedureRecipe.deleteMany({
            where: {
                recipeId: recipeIdInt,
                procedureId: {
                    in: procedureIds,
                },
            },
        });

        if (deleteProcedures.count === 0) {
            return res.status(404).json({ error: 'No Procedures in recipe found to delete' });
        }
        res.status(200).json({ msg: 'Delete Procedures in recipe successfully', deleteProcedures });
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}



module.exports = {
    getProceduresByRecipe,
    createProceduresByRecipe:[validateProcedure, createProceduresByRecipe],
    updateProcedureByRecipe:[validatePartialProcedure, updateProcedureByRecipe],
    deleteProceduresByRecipe
};

