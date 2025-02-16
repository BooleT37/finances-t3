# Expense entities architecture

## Expense

Core entity representing a financial transaction. Key properties:

- `date`: Month allocation date
- `actualDate`: Optional. Actual transaction date, defaults to `date` if not set
- `category` & `subcategory`: Hierarchical classification for grouping/aggregation
- `source`: Reference to transaction origin (e.g., bank statement)
- `subscription`: Optional link to recurring payment
- `savingSpendingCategory`: Optional. Used when `category.type === 'FROM_SAVINGS'` to track specific saving-related expenses
- `peHash`: Parsed expense hash, used as unique identifier for PDF-imported expenses
- `cost`: Decimal value of transaction amount

## ExpenseComponent

Represents a subdivision of an Expense entity. Enables:

- Splitting single expense into multiple categorized components
- Independent category/subcategory assignment per component
- Partial expense tracking (remaining amount stays in original category)
- Cross-category expense allocation (e.g., multi-category purchases)
