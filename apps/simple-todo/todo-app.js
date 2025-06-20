class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.todoInput = document.getElementById('todoInput');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.stats = document.getElementById('stats');
        this.konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        this.konamiIndex = 0;
        this.rainbowMode = false;
        
        this.bindEvents();
        this.render();
    }
    
    bindEvents() {
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            this.checkKonamiCode(e.keyCode);
        });
    }
    
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.todos.unshift(todo);
        this.todoInput.value = '';
        this.saveTodos();
        this.render();
    }
    
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }
    
    deleteTodo(id) {
        if (confirm('Are you sure you want to delete this todo?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.render();
        }
    }
    
    render() {
        if (this.todos.length === 0) {
            this.emptyState.style.display = 'block';
            this.todoList.innerHTML = '';
            this.todoList.appendChild(this.emptyState);
        } else {
            this.emptyState.style.display = 'none';
            this.todoList.innerHTML = '';
            
            this.todos.forEach(todo => {
                const todoElement = this.createTodoElement(todo);
                this.todoList.appendChild(todoElement);
            });
        }
        
        this.updateStats();
    }
    
    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        div.innerHTML = `
            <div class="todo-checkbox" onclick="app.toggleTodo('${todo.id}')"></div>
            <div class="todo-text" onclick="app.toggleTodo('${todo.id}')">${this.escapeHtml(todo.text)}</div>
            <button class="todo-delete" onclick="app.deleteTodo('${todo.id}')" title="Delete todo">×</button>
        `;
        
        return div;
    }
    
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;
        
        document.getElementById('totalTodos').textContent = total;
        document.getElementById('completedTodos').textContent = completed;
        document.getElementById('pendingTodos').textContent = pending;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    loadTodos() {
        try {
            const saved = localStorage.getItem('simple-todos');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading todos:', error);
            return [];
        }
    }
    
    saveTodos() {
        try {
            localStorage.setItem('simple-todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
            alert('Unable to save todos. Storage may be full.');
        }
    }
    
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'todos-' + new Date().toISOString().slice(0,10) + '.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    checkKonamiCode(keyCode) {
        if (keyCode === this.konamiCode[this.konamiIndex]) {
            this.konamiIndex++;
            if (this.konamiIndex === this.konamiCode.length) {
                this.toggleRainbowMode();
                this.konamiIndex = 0;
            }
        } else {
            this.konamiIndex = 0;
        }
    }
    
    toggleRainbowMode() {
        this.rainbowMode = !this.rainbowMode;
        if (this.rainbowMode) {
            document.body.classList.add('rainbow-mode');
        } else {
            document.body.classList.remove('rainbow-mode');
        }
    }
}

let app;

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new TodoApp();
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && app) {
            const freshTodos = app.loadTodos();
            if (JSON.stringify(freshTodos) !== JSON.stringify(app.todos)) {
                app.todos = freshTodos;
                app.render();
            }
        }
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TodoApp };
} else if (typeof global !== 'undefined') {
    global.TodoApp = TodoApp;
}