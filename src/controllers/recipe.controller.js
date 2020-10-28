const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
// const { recipeService } = require('../services');

const createRecipe = catchAsync(async (req, res) => {
	// const temp = '';
	res.status(httpStatus.CREATED).send({ message: 'Made it here' });
});

module.exports = {
	createRecipe,
};
