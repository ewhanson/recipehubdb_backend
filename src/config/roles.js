// const { Recipe } = require('../models');

// const roles = ['user', 'admin'];
const roles = {
	USER: 'user',
	ADMIN: 'admin',
};

const rights = {
	// eslint-disable-next-line no-unused-vars
	GET_USERS: (user, req) => {
		return true;
	},
	// eslint-disable-next-line no-unused-vars
	MANAGE_USERS: (user, req) => {
		return true;
	},
	MANAGE_SELF: (user, req) => {
		return user.id === req.param.userId;
	},
	// eslint-disable-next-line no-unused-vars
	GET_RECIPES: (user, req) => {
		return true;
	},
	// eslint-disable-next-line no-unused-vars
	MANAGE_OWN_RECIPES: (user, req) => {
		const { recipe } = req;
		if (!recipe) {
			return false;
		}

		return user.id === recipe.creator.toHexString();

		// const recipe = await Recipe.findById(params.recipeId);
		// const result = user.id === recipe.creator.toHexString();

		// return result;
	},
	// eslint-disable-next-line no-unused-vars
	MANAGE_ANY_RECIPE: (user, params) => {
		return true;
	},
};

const roleRights = new Map();
roleRights.set(roles.USER, [rights.GET_USERS, rights.MANAGE_SELF, rights.GET_RECIPES, rights.MANAGE_OWN_RECIPES]);
roleRights.set(roles.ADMIN, [
	rights.GET_USERS,
	rights.MANAGE_SELF,
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
