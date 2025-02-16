# User-related entities architecture

## User

Core authentication entity. Key properties:

- `name`: Display name
- `email`: Unique identifier
- `image`: Avatar URL
- `setupDone`: Boolean flag for initial categories setup
- One-to-many relationships with operational entities (Categories, Sources, etc.)

## Account

OAuth provider linkage entity. Key properties:

- Provider-specific tokens and IDs
- Many-to-one relationship with User
- Supports multiple providers (Discord, Google)

## Session

Authentication session management entity. Key properties:

- `sessionToken`: Unique session identifier
- `expires`: Session expiration timestamp
- Many-to-one relationship with User

## VerificationToken

Email verification entity. Key properties:

- `identifier`: User reference
- `token`: Unique verification token
- `expires`: Token expiration timestamp

## UserSetting

User-specific settings entity. Key properties:

- `pePerMonth`: (deprecated) Monthly personal expenses limit per person
- `savings`: (deprecated) Total savings amount
- `savingsDate`: (deprecated) Date when the savings were last updated
- `incomeCategoriesOrder`: Array of category IDs, representing the order of income categories
- `expenseCategoriesOrder`: Array of category IDs, representing the order of expense categories
- `sourcesOrder`: Array of source IDs, representing the order of sources
