const express = require('express');
const authRoute = require('./auth.route');
const recipeRoute = require('./recipe.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/recipes', recipeRoute);
router.use('/users', userRoute);
router.use('/docs', docsRoute);

module.exports = router;
