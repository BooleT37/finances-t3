# Forecast entity architecture

## Forecast

Core entity for monthly spending planning. Key properties:

- `category`: which category this forecast belongs to
- `subcategory`: which subcategory this forecast belongs to
- `month`: month of the forecast
- `year`: year of the forecast
- `sum`: forecasted spending amount
- `comment`: optional comment for the forecast

## Technical characteristics

- Forecast sum is always stored as a positive number
- Forecast sum for category should be more or equal to the sum of all forecasts for its subcategories
- The differenct between the category forecast and the sum of all subcategories forecasts we call "the rest" forecast
