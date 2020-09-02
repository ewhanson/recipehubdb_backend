# RecipeHubDB Backend

[![Build Status](https://travis-ci.com/ewhanson/recipehubdb_backend.svg?token=3xBcQTx8ktfYABDBnT2v&branch=master)](https://travis-ci.com/ewhanson/recipehubdb_backend)

A RESTful APIs using Node.js, Express, and Mongoose for RecipeHubDB. Architecutre inspired by and built on top of [hagopj13/node-express-mongoose-boilerplate](https://github.com/hagopj13/node-express-mongoose-boilerplate).

## Getting Started

### Installation

Clone the repo:

```bash
git clone https://github.com/ewhanson/recipehubdb_backend.git
cd recipehubdb_backend
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables
```

### Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```
