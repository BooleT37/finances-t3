# User guide for the app

All costs in the app are in Euro

# Table of Contents

1. [Data Screen](#data-screen)

   - [Table with Aggregation](#table-with-aggregation)
   - [Create Expense](#create-expense)
     - [User Cases](#user-cases)
       - [Find an Expense by Name](#find-an-expense-by-name)
       - [Create Simple Expense](#create-simple-expense)
       - [Create Income](#create-income)
       - [Create Expense with Different Month Assignment](#create-expense-and-assign-it-to-a-different-month-for-calculations)
       - [Create Expense with Subscription](#create-expense-and-assign-it-to-a-subscription)
       - [Create Expense with Saving Spending Event](#create-expense-and-assign-it-to-a-saving-spending-event)
       - [Create Split Expense](#create-expense-and-split-it-into-components)
       - [Create Multiple Expenses](#create-multiple-expenses)
   - [Edit Expense](#edit-expense)
   - [Edit Component](#edit-a-component)
   - [Delete Expense](#delete-expense)
   - [Delete Component](#delete-a-component)
   - [Import Expenses](#import-expenses-from-bank-statements)

2. [Forecast Screen](#forecast-screen)

   - [Table with Forecasts](#table-with-forecasts)
     - [User Cases](#user-cases-1)
       - [Set Current Month](#set-current-month)
       - [Set Category Forecast](#set-a-forecast-for-a-category)
       - [Set Forecast Comment](#set-a-comment-for-a-forecast)
       - [Split Forecast into Subcategories](#fill-in-a-forecast-and-then-split-it-into-subcategories-for-granularity)
       - [Sum Subcategories Forecasts](#fill-in-a-forecast-as-a-sum-of-all-subcategories-forecasts)
       - [Use Subscriptions for Forecast](#use-a-list-of-subscriptions-to-help-fill-in-a-forecast)
       - [Plan a Month](#plan-a-month)

3. [Savings Spendings Screen](#savings-spendings-screen)

   - [User Cases](#user-cases-2)
     - [Create Event without Subcategories](#create-a-saving-spending-event-without-subcategories)
     - [Create Event with Subcategories](#create-a-saving-spending-event-with-subcategories)
     - [Edit Event](#edit-a-saving-spending-event)
     - [Delete Event](#delete-a-saving-spending-event)
     - [Complete Event](#complete-a-saving-spending-event)

4. [Statistics Screen](#statistics-screen)

   - [Example User Cases](#example-user-cases)
     - [Compare Current Month to Last Year](#see-how-much-we-have-spend-in-the-current-month-compared-to-the-same-month-last-year)
     - [Compare Years](#see-how-much-we-have-spend-this-year-in-total-compared-to-last-year)
     - [View Category Dynamics](#see-the-dynamics-of-our-spendings-for-a-category)
     - [Compare Multiple Categories](#see-the-dynamics-of-our-spendings-for-several-categories)

5. [Categories Screen](#categories-screen)

   - [User Cases](#user-cases-3)
     - [Create Category](#create-a-new-category)
     - [Edit Category](#edit-a-category)
     - [Delete Category](#delete-a-category)
     - [Manage Subcategories](#manage-subcategories)
     - [Sort Categories](#sort-categories)

6. [Sources Screen](#sources-screen)

   - [User Cases](#user-cases-4)
     - [Create Source](#create-a-new-source)
     - [Edit Source](#edit-a-source)
     - [Delete Source](#delete-a-source)

7. [Subscriptions Screen](#subscriptions-screen)

   - [User Cases](#user-cases-5)
     - [Create Subscription](#create-a-new-subscription)
     - [Edit Subscription](#edit-a-subscription)
     - [Delete Subscription](#delete-a-subscription)
     - [Disable Subscription](#disable-a-subscription)

8. [Settings Screen](#settings-screen)

9. [Sidebar](#sidebar)
   - [User Cases](#user-cases-6)
     - [Navigate Screens](#navigate-to-different-screens)
     - [Logout](#logout)
     - [Toggle Sidebar](#toggle-sidebar)

## Data screen

Main flows: see current month expenses aggregated by categories, check the difference with the forecast for each category, add a new expense, manage existing expenses, import expenses from bank statements, see which subscriptions are upcoming for the current month, find expense by name.

### Table with aggregation

The screen consists of a period selector, a search bar, a button to create an expense and a table. In the table you can see all expenses aggregated by categories and optionally by subcategories. Each category/subcategory group row displays the total aggregated sum as well as the forecast for this month (if exists), plus the difference with the forecast. You can also optionally see the upcoming subscriptions for this month in the table. You can edit and delete each expense from the actions column.

### Create expense

By clicking on "Add" button, the modal opens where you can fill in expenses details:

- Income/expense switch
- Date
- (optional) Real date
- Category
- (optional)Subcategory
- Amount
- (optional) Split into components
- (optional) Comment
- (optional) Source

There is an option to add multiple expenses at once by clicking on "Add multiple expenses" button.

#### User cases

##### Find an expense by name

- Press "Search" button
- Fill in the search query
- Press "Enter"
- See expenses that match the query

When searching, the period automatically expands to encompass all expenses, not only the current month.

##### Create simple expense

- Click "Add"
- Select date
- Select category
- (optionally) Select subcategory
- Fill in amount
- Click on "Create"

##### Create income

- Click "Add"
- Click "Income" switch
- Select date
- Select category
- (optionally) Select subcategory
- Fill in amount
- Click on "Create"

##### Create expense and assign it to a different month for calculations

- Click "Add"
- Select date
- Select actual date
- Select category
- Fill in amount
- Click on "Create"

##### Create expense and assign it to a subscription

- Click "Add"
- Select date
- Select category, for which there is a subscription for this month
- Select a subscription. If the subscription selector didn't appear, it means that there is no subscription for this month.
- Check that the rest of the data was autofilled correctly
- Click on "Create"

##### Create expense and assign it to a saving spending event

- Click "Add"
- Select date
- Select category "From savings"
- Select an event from an event selector that appeared
- (If the event has more then one category) select a category
- Fill in amount
- (optional) Fill in comment
- (optional) Fill in source
- Click on "Create"

##### Create expense and split it into components

- Click "Add"
- Select date
- Select category
- (optional) Select subcategory
- Fill in amount
- Click on "Split into components"
- Fill in components details in the new modal. For each component:
  - category
  - (optional) subcategory
  - amount
  - (optional) comment
- Check that the remaining sum is not negative
- Click on "Save"
- (optionally) Fill in the comment and source
- Click on "Create"

##### Create multiple expenses

- Click on "Add"
- Fill in the data in the modal like in previous steps
- Click on "Add multiple expenses" checkbox
- Click on "Create"

### Edit expense

- Find the expense in the table
- Click on "Edit"
- Edit the data in the modal
- Click on "Save"

### Edit a component

- Find the component in the table
- Click on "Edit"
- Edit the data in the components modal
- Click on "Save" to save components
- Click on "Save" to save the expense

### Delete expense

- Find the expense in the table
- Click on "Delete"
- Confirm the deletion

### Delete a component

- Find the component in the table
- Click on "Delete"
- Confirm the deletion

### Import expenses from bank statements

- Click on "Import"
- Select source
- If there's no parser assigned for your source, click on the link in the tooltip to assign one
- Upload a file
- Check the expenses in the file
- Select the expenses you want to import (by default expenses that you already have in the app will not be selected)
- Assign each expense to a category
- Click on "Import"

## Forecast screen

Main flows: see and set forecasts for current month per category and subcategory, see totals for all expenses/incomes/savings, see the overall total for the month, see difference with expenses, see a list of subscriptions for the category/subcategory, autofill the forecast from all subscriptions.

### Table with forecasts

The table has the following columns:

- Category + subcategory. Identifies the forecast.
- Average monthly expenses. Used to figure out the forecast amount.
- Last month expenses. Used to figure out the forecast amount.
- Forecast. Used to set the forecast amount.
- Expenses. Sum of all expenses for the category/subcategory. Also displays the difference with the forecast
- Comment. Optional comment for the forecast.

There is no validations in the table. Ever. If the user wants to shoot himself in the foot and get negative difference, we let him do it.
We do not allow editing forecasts if there are subcategory forecasts already for this category. Then the forecast is calculated automatically as a sum of all subcategory forecasts (including the "Rest" subcategory).

#### User cases

##### Set current month

- Select a month from a selector at the top of the screen

##### Set a forecast for a category

- Find the category in the table
- Double click on the "Forecast" cell
- Fill in the forecast
- Press "Enter"

##### Set a comment for a forecast

- Find the forecast in the table
- Double click on the "Comment" cell
- Fill in the comment
- Press "Enter"

##### Fill in a forecast, and then split it into subcategories for granularity

- Find the category in the table
- Fill in the forecast amount
- (optional) Fill in a comment
- Expand the category row to see subcategories
- Fill in forecasts for all subcategories
- (optional) Fill in comments for all subcategories
- Check that the amount in "the rest" forecast is not negative

##### Fill in a forecast as a sum of all subcategories forecasts

- Find the category in the table
- Expand the category row to see subcategories
- Fill in forecasts for all subcategories
- (optional) Fill in comments for all subcategories
- Check, the forecast amount is adjusted automatically as a sum of all subcategories forecasts

##### Use a list of subscriptions to help fill in a forecast

- Find the category in the table
- If there is a "subscriptions" badge in the "forecast" cell, hover over it to see a list of subscriptions
- click the badge to autofill the forecast from all subscriptions total
- (optionally) increase the forecast amount to account for other expenses

##### Plan a month

- Fill in forecasts for all categories and subcategories
- Check that the total (income minus expenses)in the footer is not negative
- (optionally) move the remaining total into savings category

## Savings spendings screen

The screen is a list of saving spendings events. For each event you can see the total planned/actual expenses, split by subcategories, if any. Main user flows: create a new saving spending event, see how much we have spent for the ongoing event not to overspend on it, see how much we spent for the past events to better plan new ones.

### User cases

#### Create a saving spending event without subcategories

- Click on "Create"
- Fill in the event name
- Fill in the planned expenses amount
- (optionally) Fill in a comment
- Click on "Create"

#### Create a saving spending event with subcategories

- Click on "Create"
- Fill in the event name
- Fill in the first category cost
- Press "Add category"
- (optionally) The "name" field appears for the first category. Fill it in.
- Fill in the names, costs and optionally comments for all subcategories
- Press "Create"

#### Edit a saving spending event

- Find the event in the list
- Click on "Edit"
- Edit the data in the modal
- Click on "Save"

#### Delete a saving spending event

- Find the event in the list
- Click on "Delete"
- Confirm the deletion

#### Complete a saving spending event

- Find the event in the list
- Click on "Complete" toggle

## Statistics screen

Main flows: see expenses comparisons between two periods, see dynamics of spendings per category.

### Example user cases

#### See how much we have spend in the current month compared to the same month last year

- Go to the comparison chart
- Set the first month selector to the current month
- Set the second month selector to the same month last year
- See the expenses for the current month and the same month last year on the chart

#### See how much we have spend this year in total compared to last year

- Go to the comparison chart
- Set the period type selector to "Year"
- Set the first period selector to this year
- Set the second period selector to last year
- See the expenses for the current year and the same year last year on the chart

#### See the dynamics of our spendings for a category

- Go to the dynamics chart
- Set the start and end months
- Unselect all categories except one
- See the dynamics of spendings for the selected category

#### See the dynamics of our spendings for several categories

- Go to the dynamics chart
- Set the start and end months
- Select several categories
- See the dynamics of spendings for the selected categories compared to each other

## Categories screen

Main flows: create a new category, edit a category, delete a category, manage subcategories, sort categories.

### User cases

#### Create a new category

- Press "Add" button
- Fill in the category fields:
  - (optional) Icon
  - Is income
  - Name
  - Short name
  - Is continuous
  - (optional) Create subcategories
- Press "Create"

#### Edit a category

- Find the category in the list
- Press "Edit"
- Edit the category fields
- Press "Save"

#### Delete a category

- Find the category in the list
- Press "Delete"
- Confirm the deletion

#### Manage subcategories

- Find the category in the list
- Press "Edit"
- Go to the subcategories list
- Add/remove/rename subcategories
- Press "Save"

#### Sort categories

- Drag and drop a category to a new position in the table. Saving is done automatically.

## Sources screen

Main flows: create a new source, edit a source, delete a source, manage source parsers.

### User cases

#### Create a new source

- Press "Add" button
- Fill in the source fields directly in the table:
  - Name
  - (optional) Parser

#### Edit a source

- Find the source in the table
- Double click on the field you want to edit
- Fill in the new value
- Press "Enter"

#### Delete a source

- Find the source in the table
- Press "Delete"
- Confirm the deletion

## Subscriptions screen

Main flows: create a new subscription, edit a subscription, delete a subscription, disable a subscription, see subscriptions for a category.

### User cases

#### Create a new subscription

- Press "Add" button
- Fill in the subscription fields:
  - Name
  - Amount
  - Category
  - Period (1, 3, 6, 12 months)
  - First payment date
  - (optional) Source
- Press "Create"

#### Edit a subscription

- Find the subscription in the list
- Press "Edit"
- Edit the subscription fields
- Press "Save"

#### Delete a subscription

- Find the subscription in the list
- Press "Delete"
- Confirm the deletion

#### Disable a subscription

- Find the subscription in the list
- Press "Disable" toggle

Disabling a subscription hides it from everywhere in the app except the subscriptions list.

## Settings screen

Main flows: set personal expenses per month aamount, set the savings total

Both settings are deprecated and will be removed in future. They are not used anywhere in the app now.

## Sidebar

Main flows: navigate to different screens, logout.

### User cases

#### Navigate to different screens

- Press the screen icon in the sidebar

#### Logout

- Press "Logout" button

#### Toggle sidebar

- Press "Toggle sidebar" button
