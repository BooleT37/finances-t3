# Subscription entity architecture

## Subscription

Entity representing recurring financial commitments. Key properties:

- `name`: Identifier for the subscription
- `cost`: Decimal value of recurring payment
- `period`: Integer representing payment frequency
- `firstDate`: Initial payment date, used for period calculations
- `active`: Boolean flag for subscription status
- `category` & `subcategory`: Classification references
- `source`: Optional reference to transaction origin

Technical characteristics:

- Visual/planning entity, not used in direct calculations
- Links to actual payments via Expense entity references
- Period-based monthly allocation using `firstDate` and `period`
- Supports both income and expense types (income UI pending)
