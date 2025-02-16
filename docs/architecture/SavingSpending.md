# SavingSpending entities architecture

## SavingSpending

Entity representing planned or executed savings allocations. Key properties:

- `name`: Identifier for the savings event
- `completed`: Boolean flag preventing new expense additions
- `categories`: One-to-many relationship with SavingSpendingCategory
- Total forecast: Computed as sum of all category forecasts

Technical characteristics:

- Excluded from monthly spending calculations
- Not included in monthly forecast aggregations
- Always has at least one category
- If only one category, the list of categories is not displayed

## SavingSpendingCategory

Child entity of SavingSpending for granular tracking. Key properties:

- `name`: Optional if single category (can be empty)
- `forecast`: Decimal value of planned spending
- `comment`: Optional description field
- Unique identifier for direct expense linkage
