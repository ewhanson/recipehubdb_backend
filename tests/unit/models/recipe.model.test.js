const { Recipe } = require('../../../src/models');
const { userOne } = require('../../fixtures/user.fixture');

describe('Recipe model', () => {
	describe('Recipe validation', () => {
		let newRecipe;

		beforeEach(() => {
			newRecipe = {
				title: 'Recipe title',
				description: 'This is a recipe description',
				creator: userOne._id,
			};
		});

		test('should correctly validate a recipe', async () => {
			await expect(new Recipe(newRecipe).validate()).resolves.toBeUndefined();
		});
	});
});
