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
		prepTime: {
			type: Number,
		},
		cookTime: {
			type: Number,
		},
		yield: {
			amount: { type: Number },
			unit: { type: String },
		},
		ingredients: [
			{
				_id: false,
				title: { type: String },
				// order: { type: Number },
				items: [
					{
						_id: false,
						amount: { type: Number },
						unit: { type: String },
						ingredient: { type: String },
						note: { type: String },
						// order: { type: Number },
					},
				],
			},
		],
		instructions: [
			{
				_id: false,
				title: { type: String },
				// order: { type: Number },
				items: [
					{
						_id: false,
						text: { type: String },
						// order: { type: Number },
					},
				],
			},
		],
		tags: [{ type: String }],
		// categories, TODO: add categories at a future date
		source: { type: String },
		notes: { type: String },
		// TODO: Comments at a future date
		creator: {
			type: mongoose.ObjectId,
			ref: 'User',
			required: true,
		},
		copiedFrom: {
			type: mongoose.ObjectId,
			ref: 'Recipe',
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
