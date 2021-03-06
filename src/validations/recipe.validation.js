const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRecipe = {
	body: Joi.object().keys({
		title: Joi.string().required(),
		description: Joi.string().required(),
		prepTime: Joi.number(),
		cookTime: Joi.number(),
		yield: {
			amount: Joi.number(),
			unit: Joi.string(),
		},
		ingredients: Joi.array().items(
			Joi.object().keys({
				title: Joi.string(),
				items: Joi.array().items(
					Joi.object().keys({
						amount: Joi.number(),
						unit: Joi.string(),
						ingredient: Joi.string(),
						note: Joi.string(),
					})
				),
			})
		),
		instructions: Joi.array().items(
			Joi.object().keys({
				title: Joi.string(),
				items: Joi.array().items(
					Joi.object().keys({
						text: Joi.string(),
					})
				),
			})
		),
		tags: Joi.array().items(Joi.string()),
		source: Joi.string(),
		notes: Joi.string(),
	}),
};

const getRecipes = {
	query: Joi.object().keys({
		// TODO: Recipe filtering query parameters
		sortBy: Joi.string(),
		limit: Joi.number().integer(),
		page: Joi.number().integer(),
	}),
};

const getRecipe = {
	params: Joi.object().keys({
		recipeId: Joi.string().custom(objectId),
	}),
};

const updateRecipe = {
	params: Joi.object().keys({
		recipeId: Joi.required().custom(objectId),
	}),
	body: Joi.object()
		.keys({
			title: Joi.string(),
			description: Joi.string(),
			prepTime: Joi.number(),
			cookTime: Joi.number(),
			yield: {
				amount: Joi.number(),
				unit: Joi.string(),
			},
			ingredients: Joi.array().items(
				Joi.object().keys({
					title: Joi.string(),
					items: Joi.array().items(
						Joi.object().keys({
							amount: Joi.number(),
							unit: Joi.string(),
							ingredient: Joi.string(),
							note: Joi.string(),
						})
					),
				})
			),
			instructions: Joi.array().items(
				Joi.object().keys({
					title: Joi.string(),
					items: Joi.array().items(
						Joi.object().keys({
							text: Joi.string(),
						})
					),
				})
			),
			tags: Joi.array().items(Joi.string()),
			source: Joi.string(),
			notes: Joi.string(),
		})
		.min(1),
};

const deleteRecipe = {
	params: Joi.object().keys({
		recipeId: Joi.string().custom(objectId),
	}),
};

module.exports = {
	createRecipe,
	getRecipes,
	getRecipe,
	updateRecipe,
	deleteRecipe,
};
