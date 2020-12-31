const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
// const { roles } = require('../../src/config/roles');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
// const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
// const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');
const { recipeOneData, recipeTwoData, recipeAdminData, insertRecipes, RecipeData } = require('../fixtures/recipe.fixture');
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

	describe('GET /v1/recipes', () => {
		test('should return 200 and apply the default query options', async () => {
			await insertUsers([admin]);
			await insertRecipes([recipeOneData, recipeTwoData]);

			const res = await request(app)
				.get('/v1/recipes')
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send()
				.expect(httpStatus.OK);

			expect(res.body).toEqual({
				results: expect.any(Array),
				page: 1,
				limit: 10,
				totalPages: 1,
				totalResults: 2,
			});

			expect(res.body.results).toHaveLength(2);
			expect(res.body.results[0]).toEqual({
				id: recipeOneData.recipe._id.toHexString(),
				creator: recipeOneData.user._id.toHexString(),
				title: recipeOneData.recipe.title,
				description: recipeOneData.recipe.description,
				prepTime: recipeOneData.recipe.prepTime,
				cookTime: recipeOneData.recipe.cookTime,
				yield: recipeOneData.recipe.yield,
				ingredients: recipeOneData.recipe.ingredients,
				instructions: recipeOneData.recipe.instructions,
				tags: recipeOneData.recipe.tags,
				source: recipeOneData.recipe.source,
				notes: recipeOneData.recipe.notes,
			});
		});

		test('should return 401 if access token is missing', async () => {
			await insertRecipes([recipeOneData]);

			await request(app).get('/v1/recipes').send().expect(httpStatus.UNAUTHORIZED);
		});

		// TODO: Add test for private recipes
		// TODO: Add test for query filters once added
		// TODO: should correctly sort the returned array if descending sort param is specified
		// TODO: should correctly sort the returned array if ascending sort param is specified
		// TODO: should correctly sort the returned array if multiple sorting criteria are specified

		test('should limit returned array if limit param is specified', async () => {
			await insertRecipes([recipeOneData, recipeTwoData, recipeAdminData]);

			const res = await request(app)
				.get('/v1/recipes')
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.query({ limit: 2 })
				.send()
				.expect(httpStatus.OK);

			expect(res.body).toEqual({
				results: expect.any(Array),
				page: 1,
				limit: 2,
				totalPages: 2,
				totalResults: 3,
			});
			expect(res.body.results).toHaveLength(2);
			expect(res.body.results[0].id).toBe(recipeOneData.recipe._id.toHexString());
			expect(res.body.results[1].id).toBe(recipeTwoData.recipe._id.toHexString());
		});

		test('should return the correct page if page and limit params are specified', async () => {
			await insertRecipes([recipeOneData, recipeTwoData, recipeAdminData]);

			const res = await request(app)
				.get('/v1/recipes')
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.query({ page: 2, limit: 2 })
				.send()
				.expect(httpStatus.OK);

			expect(res.body).toEqual({
				results: expect.any(Array),
				page: 2,
				limit: 2,
				totalPages: 2,
				totalResults: 3,
			});
			expect(res.body.results).toHaveLength(1);
			expect(res.body.results[0].id).toBe(recipeAdminData.recipe._id.toHexString());
		});
	});
});
