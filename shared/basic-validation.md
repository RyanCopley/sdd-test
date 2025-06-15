# Basic Input Validation

## Todo Text Rules
- Todo text cannot be empty or just whitespace
- Maximum length should be reasonable (prevent abuse)
- Should handle special characters gracefully

## API Behavior
- Return helpful error messages for invalid input
- Use standard HTTP status codes
- Handle edge cases like very long text or special characters