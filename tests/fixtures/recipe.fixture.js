const mongoose = require('mongoose');
const faker = require('faker');
const { userOne, userTwo, admin, insertUsers } = require('./user.fixture');
const Recipe = require('../../src/models/recipe.model');

const recipeOneData = {
	recipe: {
		_id: mongoose.Types.ObjectId(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		creator: userTwo._id,
	},
	user: userOne,
};

const recipeTwoData = {
	recipe: {
		_id: mongoose.Types.ObjectId(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		creator: userTwo._id,
	},
	user: userTwo,
};

const recipeAdminData = {
	recipe: {
		_id: mongoose.Types.ObjectId(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		creator: admin._id,
	},
	user: admin,
};

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
};
