# Project Structure

This document provides an overview of the project structure and explains the purpose of key directories and files.

`prisma/schema.prisma` - The main schema file for the database. Use it as a source of truth for the database structure.

`docs/` - This directory contains the project documentation. Mostly used by AI.

`src/components` - the list of shared components that do not belong to any feature.

`src/features/` - the list of features of the app. In the root of the folder we store feature domain objets, in the form of simple js classes, with getters for computed properties.

`src/features/{featureName}/components` - the list of components that belong to the feature. Has hierarchical structure, with `{FeatureScreen}.tsx` at the top.

`src/features/{featureName}/api` - API hooks and types.

- `featureApi.ts` file contains the list of react query queries and mutations for the feature. Query functions are usually exported in the form of query params, so we can use them in facets, adding custom params on top, like `select`. This file should always export the list of query keys. Query and mutation functions call the api endpoints using trpc. All api functions accept domain models and convert them to api models. We usually call mutations in this file directly from the UI layer.
- `types.ts` file contains API types aliases.

`src/features/{featureName}/facets` - the list of facets that belong to the feature. Facets define the higher-level logic to query or mutate the data, usially involving other features.

- Each feature has "allFeatures" facet, where we wrap all it into its domain object after querying it, using `select` property. That's why we don't have data query hooks in `api` folder: domain objects don't belong to API layer, plus we often need to query dependant entities to create a domain object.

- Almost all the features have `{feature}ById` file inside `facets` folder, with two hooks `useGet{Feature}ById` and `use{Feature}ById`. The first hook returns a function to find a feature, the second one accepts an id and return the found feature right away. We use it when we can use hooks directly with the id (meaning, outside of callbacks).

`src/features/{featureName}/types` - feature-specific types.

`src/pages/` - the list of pages of the app in next.js format.

`src/server/` - server-side next.js logic

`src/server/api/routers` - api routes

`src/server/ExpensesParser` - server-side logic for parsing expenses from external sources (like PDF files).

`src/server/ExpensesParser/ExpensesParser.ts` - the main interface expenses parsers.

`src/server/auth.ts` - server-side authentication logic. contains logic for prefilling default categories for new users, and all the auth providers logic.

`src/utils/` - utility functions that do not belong to any particular feature.

`src/utils/tests` - utils used in tests. For example, very important, mocked data for tests is stored in `src/utils/tests/mockData` folder.

Test files themselves we create next to the component/util function that they test, with a suffix `.test.ts(x)`
