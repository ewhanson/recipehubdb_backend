const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const recipeValidation = require('../../validations/recipe.validation');
const recipeController = require('../../controllers/recipe.controller');

const router = express.Router();

router
	.route('/')
	.post(auth(), validate(recipeValidation.createRecipe), recipeController.createRecipe)
	.get(auth(), validate(recipeValidation.getRecipes), recipeController.getRecipes);
// TODO: PATCH /recipes/:recipeID
// TODO: DELETE /recipes/:recipeID
// router.route('/:recipeId').get().patch().post();
router.route('/:recipeId').get(auth(), validate(recipeValidation.getRecipe), recipeController.getRecipe);

module.exports = router;

// TODO: Swagger docs
