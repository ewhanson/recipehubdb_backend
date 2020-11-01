// const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Recipe } = require('../models');
// const ApiError = require('../utils/ApiError');

const createRecipe = async (user, recipeBody) => {
	const recipeData = {
		...recipeBody,
		creator: mongoose.Types.ObjectId(user.id),
	};

	const recipe = await Recipe.create(recipeData);
	return recipe;
};

module.exports = {
	createRecipe,
};
