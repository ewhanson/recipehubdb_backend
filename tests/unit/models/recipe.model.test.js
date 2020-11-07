const faker = require('faker');
const { Recipe } = require('../../../src/models');
const { userOne } = require('../../fixtures/user.fixture');

describe('Recipe model', () => {
	describe('Recipe validation', () => {
		let newRecipe;

		beforeEach(() => {
			newRecipe = {
				title: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				prepTime: faker.random.number(),
				cookTime: faker.random.number(),
				yield: {
					amount: faker.random.number(),
					unit: faker.random.word(),
				},
				ingredients: [
					{
						title: faker.company.catchPhraseNoun(),
						items: [
							{
								amount: faker.random.number(),
								unit: faker.company.bsNoun(),
								ingredient: faker.random.word(),
								note: faker.lorem.word(),
							},
						],
					},
					{
						title: faker.company.catchPhraseNoun(),
						items: [
							{
								amount: faker.random.number(),
								unit: faker.company.bsNoun(),
								ingredient: faker.random.word(),
								note: faker.lorem.word(),
							},
						],
					},
				],
				instructions: [
					{
						title: faker.company.catchPhraseNoun(),
						items: [
							{
								text: faker.hacker.phrase(),
							},
							{
								text: faker.hacker.phrase(),
							},
						],
					},
				],
				tags: [faker.hacker.adjective(), faker.hacker.adjective(), faker.hacker.adjective()],
				source: `${faker.name.firstName()} ${faker.name.lastName()}`,
				creator: userOne._id,
			};
		});

		test('should correctly validate a recipe', async () => {
			await expect(new Recipe(newRecipe).validate()).resolves.toBeUndefined();
		});
	});
});
