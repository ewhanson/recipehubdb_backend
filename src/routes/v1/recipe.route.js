const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const recipeValidation = require('../../validations/recipe.validation');
const recipeController = require('../../controllers/recipe.controller');

const router = express.Router();

// TODO: GET /recipes
// TODO: POST /recipes
router.route('/').post(validate(recipeValidation.createRecipe), recipeController.createRecipe);
// TODO: GET /recipes/:recipeID
// TODO: PATCH /recipes/:recipeID
// TODO: DELETE /recipes/:recipeID
// router.route('/:recipeId').get().patch().post();

module.exports = router;

// TODO: Swagger docs