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
                } else {
                    this.createTable()
                        .then(() => resolve())
                        .catch(reject);
                }
            });
        });
    }

    createTable() {
        return new Promise((resolve, reject) => {
            const sql = `
                CREATE TABLE IF NOT EXISTS todos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    text TEXT NOT NULL,
                    completed BOOLEAN DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;
            
            this.db.run(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    getAllTodos() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM todos ORDER BY created_at DESC';
            this.db.all(sql, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => ({
                        ...row,
                        completed: Boolean(row.completed)
                    })));
                }
            });
        });
    }

    createTodo(text) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO todos (text) VALUES (?)';
            this.db.run(sql, [text], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        text,
                        completed: false,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });
                }
            });
        });
    }

    updateTodo(id, updates) {
        return new Promise((resolve, reject) => {
            const { text, completed } = updates;
            let sql = 'UPDATE todos SET updated_at = CURRENT_TIMESTAMP';
            const params = [];

            if (text !== undefined) {
                sql += ', text = ?';
                params.push(text);
            }

            if (completed !== undefined) {
                sql += ', completed = ?';
                params.push(completed ? 1 : 0);
            }

            sql += ' WHERE id = ?';
            params.push(id);

            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Todo not found'));
                } else {
                    resolve({ id, ...updates });
                }
            });
        });
    }

    deleteTodo(id) {
        return new Promise((resolve, reject) => {
            const sql = 'DELETE FROM todos WHERE id = ?';
            this.db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    reject(new Error('Todo not found'));
                } else {
                    resolve({ deleted: true });
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = Database;