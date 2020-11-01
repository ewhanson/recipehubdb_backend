const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { recipeService } = require('../services');

const createRecipe = catchAsync(async (req, res) => {
	const recipe = await recipeService.createRecipe(req.user, req.body);
	res.status(httpStatus.CREATED).send(recipe);
});

module.exports = {
	createRecipe,
};
