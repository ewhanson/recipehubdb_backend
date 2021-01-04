const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const recipeValidation = require('../../validations/recipe.validation');
const recipeController = require('../../controllers/recipe.controller');
const { rights } = require('../../config/roles');

const router = express.Router();

router.param('recipeId', recipeController.preloadRecipe);

router
	.route('/')
	.post(auth(), validate(recipeValidation.createRecipe), recipeController.createRecipe)
	.get(auth(), validate(recipeValidation.getRecipes), recipeController.getRecipes);

router
	.route('/:recipeId')
	.get(auth(), validate(recipeValidation.getRecipe), recipeController.getRecipe)
	.patch(
		auth(rights.MANAGE_ANY_RECIPE, rights.MANAGE_OWN_RECIPES),
		validate(recipeValidation.updateRecipe),
		recipeController.updateRecipe
	)
	.delete(
		auth(rights.MANAGE_ANY_RECIPE, rights.MANAGE_OWN_RECIPES),
		validate(recipeValidation.deleteRecipe),
		recipeController.deleteRecipe
	);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Recipe creation, editing, and retrieval
 */

/**
 * @swagger
 * path:
 *   /recipes:
 *     post:
 *       summary: Create a recipe
 *       description: [Description here]
 *       tags: [Recipes]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - title
 *                 - description
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 prepTime:
 *                   type: number
 *                   description: Time in minutes.
 *                 cookTime:
 *                   type: number
 *                   description: Time in minutes.
 *                 yield:
 *                   type: object
 *                   properties:
 *                     amount:
 *                       type: number
 *                     unit:
 *                       type: string
 *               example:
 *                 title: Greatest Recipe Ever
 *                 description: This is the greatest recipe ever.
 *                 prepTime: 15
 *                 cookTime: 15
 *                 yield:
 *                   amount: 4
 *                   unit: portions
 *                 ingredients: [
 *                   {
 *                     title: Ingredients Section Name,
 *                     items: [
 *                       {
 *                         amount: 2,
 *                         unit: cloves,
 *                         ingredient: garlic,
 *                         note: crushed
 *                       },
 *                       {
 *                         amount: 2,
 *                         unit: bunches,
 *                         ingredient: parsley
 *                       }
 *                     ]
 *                   }
 *                 ]
 *                 instructions: [
 *                   {
 *                     title: Instruction Section Name,
 *                     items: [
 *                       {
 *                         text: Combine garlic and parsley in food processor.
 *                       },
 *                       {
 *                         text: Cook for 2 minutes in a pan.
 *                       }
 *                     ]
 *                   }
 *                 ]
 *                 tags: [
 *                   dinner,
 *                   testing,
 *                 ]
 *                 source: Cookbook source name
 *                 notes: Here are some notes on the recipe
 *       responses:
 *         "201":
 *           description: Created
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Recipe'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *     get:
 *       summary: Get all recipes
 *       description: Retrieves all recipes
 *       tags: [Recipes]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: sortBy
 *           schema:
 *             type: string
 *           description: sort by query in the form of field:desc/asc (ex. name:asc)
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 10
 *           description: Maximum number of recipes
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *           description: Page number
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   results:
 *                     type: array
 *                     items:
 *                       $ref: '#components/schemas/Recipe'
 *                   page:
 *                     type: integer
 *                     example: 1
 *                   limit:
 *                     type: integer
 *                     example: 10
 *                   totalPages:
 *                     type: integer
 *                     example: 1
 *                   totalResults:
 *                     type: integer
 *                     example: 1
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * path:
 *   /recipes/{id}:
 *     get:
 *       summary: Get a recipes
 *       description: Retrieves a recipe by id
 *       tags: [Recipes]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             description: Recipe id
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Recipe'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 *     patch:
 *       summary: Update a recipe
 *       description: Logged in users can only update their own recipes. Only admins can update other users' recipes.
 *       tags: [Recipes]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             description: Recipe id
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *               example:
 *                 title: New recipe title
 *                 description: This is a new description for a recipe.
 *       responses:
 *         "200":
 *           description: OK
 *           content:
 *             application/json:
 *               schema:
 *                  $ref: '#/components/schemas/Recipe'
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 *     delete:
 *       summary: Delete a recipe
 *       description: Logged in users can only delete their own recipes. Only admins can delete other users' recipes.
 *       tags: [Recipes]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: Recipe id
 *       responses:
 *         "200":
 *           description: No content
 *         "401":
 *           $ref: '#/components/responses/Unauthorized'
 *         "403":
 *           $ref: '#/components/responses/Forbidden'
 *         "404":
 *           $ref: '#/components/responses/NotFound'
 */
