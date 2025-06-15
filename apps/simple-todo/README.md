{
  "name": "simple-todo-backend",
  "version": "1.0.0",
  "description": "Backend for Simple Todo Application",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "init-db": "node src/initDb.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "sqlite3": "^5.1.6",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0",
    "supertest": "^6.3.3"
  },
  "keywords": ["todo", "api", "express", "sqlite"],
  "author": "",
  "license": "MIT"
}