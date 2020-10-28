const Joi = require('joi');

const createRecipe = {
	body: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
	}),
};

const getRecipes = {};

const getRecipe = {};

const updateRecipe = {};

const deleteRecipe = {};

module.exports = {
	createRecipe,
	getRecipes,
	getRecipe,
	updateRecipe,
	deleteRecipe,
};
