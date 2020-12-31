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

/**
 * Query for recipes
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRecipes = async (filter, options) => {
	const recipes = await Recipe.paginate(filter, options);
	return recipes;
};

module.exports = {
	createRecipe,
	queryRecipes,
};
