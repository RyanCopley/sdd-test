const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./todos.db');

db.run(`CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// API Routes
app.get('/api/todos', (req, res) => {
    db.all('SELECT * FROM todos ORDER BY created_at DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/todos', (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) {
        res.status(400).json({ error: 'Text is required' });
        return;
    }
    
    db.run('INSERT INTO todos (text) VALUES (?)', [text.trim()], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, text: text.trim(), completed: false });
    });
});

app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    const updates = [];
    const values = [];
    
    if (text !== undefined) {
        updates.push('text = ?');
        values.push(text);
    }
    if (completed !== undefined) {
        updates.push('completed = ?');
        values.push(completed);
    }
    
    if (updates.length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
    }
    
    values.push(id);
    
    db.run(`UPDATE todos SET ${updates.join(', ')} WHERE id = ?`, values, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }
        res.json({ success: true });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Todo not found' });
            return;
        }
        res.status(204).send();
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Todo app server running on port ${PORT}`);
});
