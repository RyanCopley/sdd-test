const http = require('http');
const { test, describe } = require('node:test');
const assert = require('node:assert');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const body = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, body, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

describe('Todo API Tests', () => {
  let testTodoId;

  test('GET /api/todos should return empty array initially', async () => {
    const response = await makeRequest('/api/todos');
    assert.strictEqual(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });

  test('POST /api/todos should create a new todo', async () => {
    const response = await makeRequest('/api/todos', {
      method: 'POST',
      body: { text: 'Test todo item' }
    });
    
    assert.strictEqual(response.status, 201);
    assert.ok(response.body.id);
    assert.strictEqual(response.body.text, 'Test todo item');
    assert.strictEqual(response.body.completed, false);
    
    testTodoId = response.body.id;
  });

  test('POST /api/todos should reject empty text', async () => {
    const response = await makeRequest('/api/todos', {
      method: 'POST',
      body: { text: '' }
    });
    
    assert.strictEqual(response.status, 400);
    assert.ok(response.body.error);
  });

  test('POST /api/todos should reject text over 500 characters', async () => {
    const longText = 'x'.repeat(501);
    const response = await makeRequest('/api/todos', {
      method: 'POST',
      body: { text: longText }
    });
    
    assert.strictEqual(response.status, 400);
    assert.ok(response.body.error.includes('500 characters'));
  });

  test('PUT /api/todos/:id should update todo completion', async () => {
    const response = await makeRequest(`/api/todos/${testTodoId}`, {
      method: 'PUT',
      body: { completed: true }
    });
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.completed, true);
  });

  test('PUT /api/todos/:id should update todo text', async () => {
    const response = await makeRequest(`/api/todos/${testTodoId}`, {
      method: 'PUT',
      body: { text: 'Updated todo text' }
    });
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.text, 'Updated todo text');
  });

  test('PUT /api/todos/999 should return 404 for non-existent todo', async () => {
    const response = await makeRequest('/api/todos/999', {
      method: 'PUT',
      body: { completed: true }
    });
    
    assert.strictEqual(response.status, 404);
  });

  test('DELETE /api/todos/:id should delete todo', async () => {
    const response = await makeRequest(`/api/todos/${testTodoId}`, {
      method: 'DELETE'
    });
    
    assert.strictEqual(response.status, 204);
  });

  test('DELETE /api/todos/999 should return 404 for non-existent todo', async () => {
    const response = await makeRequest('/api/todos/999', {
      method: 'DELETE'
    });
    
    assert.strictEqual(response.status, 404);
  });

  test('Frontend should be served at root', async () => {
    const response = await makeRequest('/');
    assert.strictEqual(response.status, 200);
    assert.ok(response.body.includes('Simple Todo'));
  });
});

console.log('Running API tests...');
console.log('Make sure the server is running on port 3000 before running tests.');
console.log('Start server with: npm start');