# Simple Todo API Specification

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### GET /todos
Retrieve all todos.

**Response:**
```json
[
  {
    "id": 1,
    "text": "Buy groceries",
    "completed": false,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

**Status Codes:**
- 200: Success
- 500: Server error

---

### POST /todos
Create a new todo.

**Request Body:**
```json
{
  "text": "Learn Node.js"
}
```

**Response:**
```json
{
  "id": 2,
  "text": "Learn Node.js",
  "completed": false,
  "created_at": "2024-01-15T10:35:00.000Z"
}
```

**Validation Rules:**
- `text` is required and cannot be empty or whitespace only
- `text` cannot exceed 500 characters
- Special characters are safely handled

**Status Codes:**
- 201: Todo created successfully
- 400: Invalid input (validation error)
- 500: Server error

**Error Response:**
```json
{
  "error": "Todo text is required"
}
```

---

### PUT /todos/:id
Update todo completion status.

**URL Parameters:**
- `id` (integer): Todo ID

**Request Body:**
```json
{
  "completed": true
}
```

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- 200: Todo updated successfully
- 400: Invalid todo ID or completed status
- 404: Todo not found
- 500: Server error

---

### DELETE /todos/:id
Delete a todo.

**URL Parameters:**
- `id` (integer): Todo ID

**Response:**
```json
{
  "success": true
}
```

**Status Codes:**
- 200: Todo deleted successfully
- 400: Invalid todo ID
- 404: Todo not found
- 500: Server error

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes used:
- **200**: Success
- **201**: Created
- **400**: Bad Request (client error)
- **404**: Not Found
- **500**: Internal Server Error

## Data Types

### Todo Object
```typescript
{
  id: number;           // Auto-generated unique identifier
  text: string;         // Todo text content (1-500 characters)
  completed: boolean;   // Completion status
  created_at: string;   // ISO 8601 timestamp
}
```

## Rate Limiting
No rate limiting is currently implemented. This is a simple application intended for personal use.

## Authentication
No authentication is required. This is a simple single-user application.