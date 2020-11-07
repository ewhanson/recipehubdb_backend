const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
// const { roles } = require('../../src/config/roles');
const { userOne, insertUsers } = require('../fixtures/user.fixture');
// const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken } = require('../fixtures/token.fixture');
// const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { RecipeData } = require('../fixtures/recipe.fixture');
const { Recipe } = require('../../src/models');

setupTestDB();

describe('Recipe routes', () => {
	describe('POST /v1/recipes', () => {
		let newRecipe;

		beforeEach(() => {
			newRecipe = new RecipeData().data;
		});

		test('should return 201 and successfully create new recipe if data is ok', async () => {
			await insertUsers([userOne]);

			const res = await request(app)
				.post('/v1/recipes')
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send(newRecipe)
				.expect(httpStatus.CREATED);

			expect(res.body).toEqual({
				...newRecipe,
				id: expect.anything(),
				creator: userOne._id.toHexString(),
			});

			const dbRecipe = await Recipe.findById(res.body.id);
			expect(dbRecipe).toBeDefined();

			expect(dbRecipe.toJSON()).toMatchObject({
				...newRecipe,
				id: expect.anything(),
				creator: userOne._id,
			});
		});

		test('should return 401 error if access token is missing', async () => {
			await request(app).post('/v1/recipes').send(newRecipe).expect(httpStatus.UNAUTHORIZED);
		});
	});
});
