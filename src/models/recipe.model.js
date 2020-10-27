const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const recipeSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		creator: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

// add plugin that converts mongoose to json
recipeSchema.plugin(toJSON);
recipeSchema.plugin(paginate);

/**
 * @typedef Recipe
 */
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
