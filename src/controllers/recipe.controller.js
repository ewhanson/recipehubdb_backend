const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { recipeService } = require('../services');

const createRecipe = catchAsync(async (req, res) => {
	const recipe = await recipeService.createRecipe(req.user, req.body);
	res.status(httpStatus.CREATED).send(recipe);
});

const getRecipes = catchAsync(async (req, res) => {
	const filter = {};
	// const filter = pick(req.query, ['username', 'role']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const result = await recipeService.queryRecipes(filter, options);
	res.send(result);
});

module.exports = {
	createRecipe,
	getRecipes,
};
