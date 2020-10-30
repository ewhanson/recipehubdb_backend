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
};

const roleRights = new Map();
roleRights.set(roles.USER, []);
roleRights.set(roles.ADMIN, [rights.GET_USERS, rights.MANAGE_USERS]);

module.exports = {
	roles,
	rights,
	roleRights,
};
