const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, '..', 'todos.db');
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.db.run(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            completed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  getAllTodos() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM todos ORDER BY created_at DESC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows.map(row => ({
            id: row.id,
            text: row.text,
            completed: Boolean(row.completed),
            created_at: row.created_at
          })));
        }
      });
    });
  }

  createTodo(text) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO todos (text) VALUES (?)', [text], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, text, completed: false });
        }
      });
    });
  }

  updateTodo(id, completed) {
    return new Promise((resolve, reject) => {
      this.db.run('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Todo not found'));
        } else {
          resolve();
        }
      });
    });
  }

  deleteTodo(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Todo not found'));
        } else {
          resolve();
        }
      });
    });
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = Database;