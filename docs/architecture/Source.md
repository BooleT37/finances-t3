# Source entity architecture

## Source

Entity for expense origin tracking. Key properties:

- `name`: Source identifier
- `parser`: Optional enum reference to ExpensesParser
- One-to-many relationship with Expense entities

Technical characteristics:

- Visual organization entity
- Parser integration enables automated expense import
- Required for parser-based expense imports

## ExpensesParser

Enum type for supported expense parsers:

- Implements `ExpensesParser` interface
- Currently supported: `VIVID`
- Used for automated statement parsing
