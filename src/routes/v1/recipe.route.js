const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const recipeValidation = require('../../validations/recipe.validation');
const recipeController = require('../../controllers/recipe.controller');
const { rights } = require('../../config/roles');

const router = express.Router();

router.param('recipeId', recipeController.preloadRecipe);

router
	.route('/')
	.post(auth(), validate(recipeValidation.createRecipe), recipeController.createRecipe)
	.get(auth(), validate(recipeValidation.getRecipes), recipeController.getRecipes);

// TODO: Still needs `rights.MANAGE_ANY_RECIPE, rights.MANAGE_OWN_RECIPES` in refactor
router
	.route('/:recipeId')
	.get(auth(), validate(recipeValidation.getRecipe), recipeController.getRecipe)
	.patch(
		auth(rights.MANAGE_ANY_RECIPE, rights.MANAGE_OWN_RECIPES),
		validate(recipeValidation.updateRecipe),
		recipeController.updateRecipe
	)
	.delete(
		auth(rights.MANAGE_ANY_RECIPE, rights.MANAGE_OWN_RECIPES),
		validate(recipeValidation.deleteRecipe),
		recipeController.deleteRecipe
	);

module.exports = router;

// TODO: Swagger docs
