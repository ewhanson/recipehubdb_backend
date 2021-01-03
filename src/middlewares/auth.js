const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

/**
 * Check if a user role has the required rights and passes the associated tests
 * @param user
 * @param req
 * @param {Array} requiredRights
 * @returns {boolean}
 */
const checkRoleRights = (user, req, requiredRights) => {
	const userRights = roleRights.get(user.role);

	return requiredRights.some((requiredRight) => {
		const includesRequiredRight = userRights.includes(requiredRight);
		const passesRightsTest = requiredRight(user, req);

		return includesRequiredRight && passesRightsTest;
	});
};

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
	if (err || info || !user) {
		return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
	}
	req.user = user.toJSON();

	// First, check if there are required rights
	if (requiredRights.length) {
		// Next, check if user passes required role rights tests
		const hasRequiredRights = checkRoleRights(user, req, requiredRights);
		// TODO: Transfer userId check to role right tests
		if (!hasRequiredRights && req.params.userId !== user.id) {
			return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
		}
	}

	resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
	return new Promise((resolve, reject) => {
		passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
	})
		.then(() => next())
		.catch((err) => next(err));
};

module.exports = auth;
