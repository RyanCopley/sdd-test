# Simple Todo API Specification

## Base URL
```
http://localhost:3000
```

## Endpoints

### GET /api/todos
Retrieve all todos.

**Response:**
- Status: 200 OK
- Content-Type: application/json

```json
[
  {
    "id": 1,
    "text": "Buy groceries",
    "completed": false,
    "created_at": "2023-12-01T10:00:00.000Z"
  }
]
```

### POST /api/todos
Create a new todo.

**Request Body:**
```json
{
  "text": "Todo text here"
}
```

**Validation Rules:**
- `text` is required
- `text` cannot be empty or whitespace only
- `text` maximum length: 500 characters

**Response:**
- Status: 201 Created
- Content-Type: application/json

```json
{
  "id": 2,
  "text": "Todo text here",
  "completed": false
}
```

**Error Response:**
- Status: 400 Bad Request
```json
{
  "error": "Todo text cannot be empty"
}
```

### PUT /api/todos/:id
Update a todo's completion status.

**URL Parameters:**
- `id` (integer): Todo ID

**Request Body:**
```json
{
  "completed": true
}
```

**Response:**
- Status: 200 OK
- Content-Type: application/json

```json
{
  "id": 1,
  "completed": true
}
```

**Error Responses:**
- Status: 400 Bad Request - Invalid ID or completed value
- Status: 404 Not Found - Todo not found

### DELETE /api/todos/:id
Delete a todo.

**URL Parameters:**
- `id` (integer): Todo ID

**Response:**
- Status: 204 No Content

**Error Responses:**
- Status: 400 Bad Request - Invalid ID
- Status: 404 Not Found - Todo not found

## Error Handling

All error responses follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error