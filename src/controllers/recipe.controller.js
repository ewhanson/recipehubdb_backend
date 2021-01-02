const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
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

const getRecipe = catchAsync(async (req, res) => {
	let recipe;

	if (!req.recipe) {
		recipe = await recipeService.getRecipeById(req.params.recipeId);
	} else {
		recipe = req.recipe;
	}

	if (!recipe) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
	}
	res.send(recipe);
});

const updateRecipe = catchAsync(async (req, res) => {
	const recipe = await recipeService.updateRecipeById(req.params.recipeId, req.body);
	res.send(recipe);
});

const deleteRecipe = catchAsync(async (req, res) => {
	await recipeService.deleteRecipeById(req.params.recipeId);
	res.status(httpStatus.NO_CONTENT).send();
});

const preloadRecipe = async (req, res, next, recipeId) => {
	try {
		const recipe = await recipeService.getRecipeById(recipeId);
		if (!recipe) {
			throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
		}
		req.recipe = recipe;
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = {
	createRecipe,
	getRecipes,
	getRecipe,
	updateRecipe,
	deleteRecipe,
	preloadRecipe,
};
