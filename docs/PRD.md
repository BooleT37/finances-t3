# Product Requirements Document

This project is a web application that allows you to track and plan your personal expenses. Primarily, it allows you to aggregate your expenses by sources and categories, plan next month expenses for these categories, and track your spendings against the plan. Apart from that, it allows you to manage subscriptions, keep log of spendings from savings (e.g. vacations), split expenses by components, and see statistics of your spendings.

Technically, it's a web application that uses React, react-query, Ant Design, Next.js, Prisma, styled-components, trpc, next-auth. It does NOT use Tailwind CSS. The database is PostgreSQL. For testing it uses vitest and react-testing-library. It was bootstrapped via create-t3-app.

## Core functionalities

### Categories

Categories are the main mean to classify and aggregate expenses, forecasts and subscriptions. The main purpose of categories is to enable planning: for each month we see how much we spent in each category last month and on average, and how many subscriptions we have next month. That alllows us to estimate how much we'll spend in each category next month. Category can be either an income or an expense.

### Subcategories

Subcategories are used to allow more granular classification of spendings or forecasts within a certain category. For spendings, it allows us to split a single expense into multiple components. For forecasts, it allows us to plan a category forecast as a sum of all its subcategories forecasts, if we want to (we can still plan a category forecast as a single value if we want to). Subcategory is an income subcategory if it's tied to an income category, and an expense subcategory if it's tied to an expense category.

### Sources

Sources are the means by which we pay for the expenses. They are used to simplify figuring out which expense we have filled in last, so we continue filling in the same source, to simplify finding expenses, and to enable different mechanisms of importing expenses for different sources. Everywhere it's used, a source is an optional field, as it's used only for convenience, not for critical calculations.

### Expenses

Expense is a main entity of the app. It represents a single expense transaction in a banking app or a single purchase in a store. It is tied to a category and optionally a subcategory. It has a date, that is used for displaying purposes and for aggregation of expenses by month. If we need to use a different data for displaying and for aggregation, we can use two different dates for this. Each expense can belong to either a subscription (so we mark it as "paid" for this month), or a saving spending (so we account for it in the saving spending event). It can also be split into components, to allow more granular tracking of spendings, or even to tie a part of the expense to a different category alltogether. Each expense can also be an income, if it's tied to an income category.

### Forecast

Forecast is a plan for a category or a subcategory for a certain month. We only need subcateory forecasts for more granular planning. We don't use it for anything else really, the main entity we plan against is still always a category forecst.

### Saving spending

Saving spending is an event for which we paid for exclusively from savings. It's main purpose is to not have spendings from savings complitely omitted in the app, to still have a place to put them. To use this feature, we need to create a saving spending event, and optionally add categories to it, with a forecast for each category. Saving spending categories are NOT related to regular categories. Then if we add an expense from savings, we assign an event and a saving spending category to it. Then, we'll see the aggregated spendings from savings in the app, split by categories, and can judge whether we spent too much on this event, and if yes, which category is the most expensive.

### Subscription

Subscription is a recurring expense that we pay for. It's tied to a category and an optional subcategory (subcategories support is not implemented yet, but I plan to do it). It has a cost, a period, and a first date. It can be active or inactive. If it's active, we see it in the planning screen, to automatically account for it when we create a category forecast, in the expenses screen, to be able to see how many subscriptions we still have to pay this month, and in the "New expense" modal, to be able to automatically fill in the expesne data from the subscription.

### User settings

User settings is a place where we can set some user-specific preferences, like current user savings and personal expenses per month (both features are deprecated, will be removed soon), and order of categories and sources in the app.
