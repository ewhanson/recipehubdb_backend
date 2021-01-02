const request = require('supertest');
const httpStatus = require('http-status');
const faker = require('faker');
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

	describe('GET /v1/recipes/:recipeId', () => {
		test('should return 200 and the user object if data is ok', async () => {
			await insertRecipes([recipeOneData]);

			const res = await request(app)
				.get(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send()
				.expect(httpStatus.OK);

			expect(res.body).toEqual({
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

			await request(app).get(`/v1/recipes/${recipeOneData.recipe._id}`).send().expect(httpStatus.UNAUTHORIZED);
		});

		test("should return 200 OK if user is trying to access another user's recipe", async () => {
			await insertRecipes([recipeOneData, recipeTwoData]);

			await request(app)
				.get(`/v1/recipes/${recipeTwoData.recipe._id}`)
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send()
				.expect(httpStatus.OK);
		});

		test("should return 200 OK and recipe if admin is trying to access another user's recipe", async () => {
			await insertRecipes([recipeOneData, recipeAdminData]);

			await request(app)
				.get(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send()
				.expect(httpStatus.OK);
		});

		test('should return 400 error if recipeId is not a valid mongo id', async () => {
			await insertRecipes([recipeOneData]);

			await request(app)
				.get('/v1/recipes/invalidId')
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send()
				.expect(httpStatus.BAD_REQUEST);
		});

		test('should return 404 error if recipe is not found', async () => {
			await insertRecipes([recipeOneData]);

			await request(app)
				.get(`v1/recipes/${recipeTwoData.recipe._id}`)
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send()
				.expect(httpStatus.NOT_FOUND);
		});
	});

	describe('PATCH /v1/recipes/:recipeId', () => {
		test('should return 200 and successfully update recipe if data is ok', async () => {
			await insertRecipes([recipeOneData]);
			const updateBody = {
				...new RecipeData().data,
			};

			const res = await request(app)
				.patch(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send(updateBody)
				.expect(httpStatus.OK);

			expect(res.body).toEqual({
				...updateBody,
				creator: recipeOneData.recipe.creator.toHexString(),
				id: recipeOneData.recipe._id.toHexString(),
			});

			const dbRecipe = await Recipe.findById(recipeOneData.recipe._id);
			expect(dbRecipe).toBeDefined();
			expect(dbRecipe.toJSON()).toMatchObject({
				...updateBody,
				creator: recipeOneData.recipe.creator,
				id: recipeOneData.recipe._id.toHexString(),
			});
		});

		test('should return 401 error if access token is missing', async () => {
			await insertRecipes([recipeOneData]);
			const updateBody = { title: faker.commerce.productName() };

			await request(app).patch(`/v1/recipes/${recipeOneData.recipe._id}`).send(updateBody).expect(httpStatus.UNAUTHORIZED);
		});

		test("should return 403 if user is updating another user's recipe", async () => {
			insertRecipes([recipeOneData, recipeTwoData]);

			const updateBody = { title: faker.commerce.productName() };

			await request(app)
				.patch(`/v1/recipes/${recipeTwoData.recipe._id}`)
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send(updateBody)
				.expect(httpStatus.FORBIDDEN);
		});

		test("should return 200 and successfully update recipe if admin is updating another user's recipe", async () => {
			await insertUsers([admin]);
			await insertRecipes([recipeOneData]);

			const updateBody = { title: faker.commerce.productName() };

			await request(app)
				.patch(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send(updateBody)
				.expect(httpStatus.OK);
		});

		test("should return 404 if admin is updaing another user's recipe that is not found", async () => {
			await insertUsers([admin]);

			const updateBody = { title: faker.commerce.productName() };

			await request(app)
				.patch(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send(updateBody)
				.expect(httpStatus.NOT_FOUND);
		});

		test('should return 400 error if recipeId is not a valid mongo id', async () => {
			await insertUsers([admin]);
			const updateBody = { title: faker.commerce.productName() };

			await request(app)
				.patch('/v1/recipes/invalidId')
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send(updateBody)
				.expect(httpStatus.BAD_REQUEST);
		});

		// TODO: should return XXX (400?) if attempting to change creator
	});

	describe('DELETE /v1/recipes/:recipeId', () => {
		test('should return 204 if data is ok', async () => {
			await insertRecipes([recipeOneData]);

			await request(app)
				.delete(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send()
				.expect(httpStatus.NO_CONTENT);

			const dbRecipe = await Recipe.findById(recipeOneData.recipe._id);
			expect(dbRecipe).toBeNull();
		});

		test('should return 401 error if access token is missing', async () => {
			await insertRecipes([recipeOneData]);

			await request(app).delete(`/v1/recipes/${recipeOneData.recipe._id}`).send().expect(httpStatus.UNAUTHORIZED);
		});

		test("should return 403 error if user is trying to delete another user's recipe", async () => {
			await insertUsers([userOne]);
			await insertRecipes([recipeTwoData]);

			await request(app)
				.delete(`/v1/recipes/${recipeTwoData.recipe._id}`)
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send()
				.expect(httpStatus.FORBIDDEN);
		});

		test("should return 204 if admin is trying to delete another user's recipe", async () => {
			await insertUsers([admin]);
			await insertRecipes([recipeOneData]);

			await request(app)
				.delete(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send()
				.expect(httpStatus.NO_CONTENT);
		});

		test('should return 400 error if recipeId is not a valid mongo id', async () => {
			await insertRecipes([recipeOneData]);

			await request(app)
				.delete('/v1/recipes/invalidId')
				.set('Authorization', `Bearer ${userOneAccessToken}`)
				.send()
				.expect(httpStatus.BAD_REQUEST);
		});

		test('should return 404 error if recipe already is not found', async () => {
			await insertUsers([admin]);

			await request(app)
				.delete(`/v1/recipes/${recipeOneData.recipe._id}`)
				.set('Authorization', `Bearer ${adminAccessToken}`)
				.send()
				.expect(httpStatus.NOT_FOUND);
		});
	});
});
