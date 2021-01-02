// const { Recipe } = require('../models');

// const roles = ['user', 'admin'];
const roles = {
	USER: 'user',
	ADMIN: 'admin',
};

const rights = {
	// eslint-disable-next-line no-unused-vars
	GET_USERS: (user, params) => {
		return true;
	},
	// eslint-disable-next-line no-unused-vars
	MANAGE_USERS: (user, params) => {
		return true;
	},
	// eslint-disable-next-line no-unused-vars
	GET_RECIPES: (user, params) => {
		return true;
	},
	// eslint-disable-next-line no-unused-vars
	MANAGE_OWN_RECIPES: (user, params) => {
		// TODO: Add in test logic
		// const recipe = await Recipe.findById(params.recipeId);
		// const result = user.id === recipe.creator.toHexString();

		// return result;

		return true;
	},
	// eslint-disable-next-line no-unused-vars
	MANAGE_ANY_RECIPE: (user, params) => {
		// TODO: Add in test logic
		return true;
	},
};

const roleRights = new Map();
roleRights.set(roles.USER, [rights.GET_USERS, rights.GET_RECIPES, rights.MANAGE_OWN_RECIPES]);
roleRights.set(roles.ADMIN, [
	rights.GET_USERS,
	rights.MANAGE_USERS,
	rights.GET_RECIPES,
	rights.MANAGE_OWN_RECIPES,
	rights.MANAGE_ANY_RECIPE,
]);

module.exports = {
	roles,
	rights,
	roleRights,
};
