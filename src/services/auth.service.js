const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
	const user = await userService.getUserByEmail(email);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	} else if (!(await user.isVerified())) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Unverified user');
	}
	return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
	const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: 'refresh', blacklisted: false });
	if (!refreshTokenDoc) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
	}
	await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
	try {
		const refreshTokenDoc = await tokenService.verifyToken(refreshToken, 'refresh');
		const user = await userService.getUserById(refreshTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await refreshTokenDoc.remove();
		return tokenService.generateAuthTokens(user);
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
	}
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
	try {
		const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, 'resetPassword');
		const user = await userService.getUserById(resetPasswordTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: 'resetPassword' });
		await userService.updateUserById(user.id, { password: newPassword });
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
	}
};

/**
 * Verify user account
 * @param {string }verificationToken
 * @returns {Promise}
 */
const verifyAccount = async (verificationToken) => {
	try {
		const verificationTokenDoc = await tokenService.verifyToken(verificationToken, 'accountVerification');
		const user = await userService.getUserById(verificationTokenDoc.user);
		if (!user) {
			throw new Error();
		}
		await Token.deleteMany({ user: user.id, type: 'accountVerification' });
		await userService.updateUserById(user.id, { verified: true });
	} catch (error) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'User account verification failed');
	}
};

module.exports = {
	loginUserWithEmailAndPassword,
	logout,
	refreshAuth,
	resetPassword,
	verifyAccount,
};
