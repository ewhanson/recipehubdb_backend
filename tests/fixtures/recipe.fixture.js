// eslint-disable-next-line max-classes-per-file
const mongoose = require('mongoose');
const faker = require('faker');
const { userOne, userTwo, admin, insertUsers } = require('./user.fixture');
const Recipe = require('../../src/models/recipe.model');

class IngredientItem {
	constructor() {
		this.data = {
			amount: faker.random.number(),
			unit: faker.company.bsNoun(),
			ingredient: faker.random.word(),
			note: faker.lorem.word(),
		};
	}
}

class InstructionItem {
	constructor() {
		this.data = {
			text: faker.hacker.phrase(),
		};
	}
}

class IngredientGroup {
	constructor() {
		this.data = {
			title: faker.company.catchPhraseNoun(),
			items: [new IngredientItem().data, new IngredientItem().data, new IngredientItem().data],
		};
	}
}

class InstructionsGroup {
	constructor() {
		this.data = {
			title: faker.company.catchPhraseNoun(),
			items: [new InstructionItem().data, new InstructionItem().data, new InstructionItem().data],
		};
	}
}

class RecipeData {
	constructor() {
		this.data = {
			title: faker.commerce.productName(),
			description: faker.commerce.productDescription(),
			prepTime: faker.random.number(),
			cookTime: faker.random.number(),
			yield: {
				amount: faker.random.number(),
				unit: faker.random.word(),
			},
			ingredients: [new IngredientGroup().data, new IngredientGroup().data],
			instructions: [new InstructionsGroup().data, new InstructionsGroup().data],
			tags: [faker.hacker.adjective(), faker.hacker.adjective(), faker.hacker.adjective()],
			source: `${faker.name.firstName()} ${faker.name.lastName()}`,
			notes: faker.random.words(),
		};
	}
}

const newRecipeDataFromClass = () => {
	return new RecipeData().data;
};

const recipeOneData = {
	recipe: {
		_id: mongoose.Types.ObjectId(),
		...newRecipeDataFromClass(),
		creator: userOne._id,
	},
	user: userOne,
};

const recipeTwoData = {
	recipe: {
		_id: mongoose.Types.ObjectId(),
		...newRecipeDataFromClass(),
		creator: userTwo._id,
	},
	user: userTwo,
};

const recipeAdminData = {
	recipe: {
		_id: mongoose.Types.ObjectId(),
		...newRecipeDataFromClass(),
		creator: admin._id,
	},
	user: admin,
};

/**
 *
 * @param recipesData {Array}
 * @returns {Promise<void>}
 */
const insertRecipes = async (recipesData) => {
	const users = [];
	const recipes = [];
	recipesData.forEach((recipeData) => {
		users.push(recipeData.user);
		recipes.push(recipeData.recipe);
	});

	await insertUsers(users);
	await Recipe.insertMany(recipes.map((recipe) => recipe));
};

module.exports = {
	recipeOneData,
	recipeTwoData,
	recipeAdminData,
	insertRecipes,
	RecipeData,
};
