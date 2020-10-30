const faker = require('faker');
const { roles } = require('../../../src/config/roles');
const { User } = require('../../../src/models');

describe('User model', () => {
	describe('User validation', () => {
		let newUser;
		beforeEach(() => {
			newUser = {
				username: faker.internet.userName(),
				email: faker.internet.email().toLowerCase(),
				password: 'password1',
				role: roles.USER,
				verified: true,
			};
		});

		test('should correctly validate a valid user', async () => {
			await expect(new User(newUser).validate()).resolves.toBeUndefined();
		});

		test('should throw a validation error if email is invalid', async () => {
			newUser.email = 'invalidEmail';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if username contains invalid characters', async () => {
			newUser.username = '$username';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if username begins with _', async () => {
			newUser.username = '_username';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if username ends with _', async () => {
			newUser.username = 'username_';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if username contains __', async () => {
			newUser.username = 'user__name';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if username contains whitespace', async () => {
			newUser.username = 'user name';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if password length is less than 8 characters', async () => {
			newUser.password = 'passwo1';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if password does not contain numbers', async () => {
			newUser.password = 'password';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if password does not contain letters', async () => {
			newUser.password = '11111111';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});

		test('should throw a validation error if role is unknown', async () => {
			newUser.role = 'invalid';
			await expect(new User(newUser).validate()).rejects.toThrow();
		});
	});

	describe('User toJSON()', () => {
		test('should not return user password when toJSON is called', () => {
			const newUser = {
				username: faker.internet.userName(),
				email: faker.internet.email().toLowerCase(),
				password: 'password1',
				role: roles.USER,
			};
			expect(new User(newUser).toJSON()).not.toHaveProperty('password');
		});
	});
});
