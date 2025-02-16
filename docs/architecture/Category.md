# Category and subcategory entity architecture

## Category

Core classification entity used across expense, forecast, and subscription entities. Key properties:

- `name`: Primary identifier
- `isIncome`: Boolean flag for income/expense classification
- `isContinuous`: Boolean flag for spending trend alerts
- `shortname`: Abbreviated name for chart display (≤16 chars)
- `icon`: Reference to Ant Design icon
- `type`: Enum (`FROM_SAVINGS`, `TO_SAVINGS`) for special handling
- One-to-many relationship with subcategories

Technical characteristics:

- Cost is stored as positive values
- Special types (`FROM_SAVINGS`, `TO_SAVINGS`) have protected deletion
- Used in expense aggregation and forecast calculations

## Subcategory

Child entity of Category for granular classification. Key properties:

- `name`: Subcategory identifier
- Many-to-one relationship with parent Category
- Used in expense and forecast granular allocation
- Optional relationship - categories may have zero or more subcategories
