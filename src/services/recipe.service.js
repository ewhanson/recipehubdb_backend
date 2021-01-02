// const httpStatus = require('http-status');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { Recipe } = require('../models');
const ApiError = require('../utils/ApiError');

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

/**
 * Get recipe by id
 * @param {ObjectId} id
 * @returns {Promise<Recipe>}
 */
const getRecipeById = async (id) => {
	return Recipe.findById(id);
};

/**
 * Update recipe by id
 * @param {ObjectId} recipeId
 * @param {Object} updateBody
 * @returns {Promise<Recipe>}
 */
const updateRecipeById = async (recipeId, updateBody) => {
	const recipe = await getRecipeById(recipeId);

	if (!recipe) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
	}

	// TODO: Prevent changing creator
	Object.assign(recipe, updateBody);

	await recipe.save();
	return recipe;
};

/**
 * Delete recipe by id
 * @param {ObjectId} recipeId
 * @returns {Promise<Recipe>}
 */
const deleteRecipeById = async (recipeId) => {
	const recipe = await getRecipeById(recipeId);
	if (!recipe) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Recipe not found');
	}
	await recipe.remove();
	return recipe;
};

module.exports = {
	createRecipe,
	queryRecipes,
	getRecipeById,
	updateRecipeById,
	deleteRecipeById,
};
