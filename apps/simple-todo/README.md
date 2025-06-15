class TodoApp {
    constructor() {
        this.todos = [];
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.errorMessage = document.getElementById('error-message');
        this.emptyState = document.getElementById('empty-state');
        
        this.init();
    }
    
    init() {
        this.todoForm.addEventListener('submit', this.handleSubmit.bind(this));
        this.loadTodos();
    }
    
    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            if (!response.ok) {
                throw new Error('Failed to load todos');
            }
            this.todos = await response.json();
            this.renderTodos();
        } catch (error) {
            this.showError('Failed to load todos. Please refresh the page.');
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const text = this.todoInput.value.trim();
        if (!text) {
            this.showError('Please enter a todo item');
            return;
        }
        
        this.hideError();
        this.setLoading(true);
        
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create todo');
            }
            
            const newTodo = await response.json();
            this.todos.unshift(newTodo);
            this.todoInput.value = '';
            this.renderTodos();
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }
    
    async toggleTodo(id, completed) {
        const originalTodos = [...this.todos];
        
        const todoIndex = this.todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            this.todos[todoIndex].completed = completed;
            this.renderTodos();
        }
        
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
            
            const updatedTodo = await response.json();
            const index = this.todos.findIndex(todo => todo.id === id);
            if (index !== -1) {
                this.todos[index] = updatedTodo;
            }
            
        } catch (error) {
            this.todos = originalTodos;
            this.renderTodos();
            this.showError('Failed to update todo');
        }
    }
    
    async deleteTodo(id) {
        const originalTodos = [...this.todos];
        
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.renderTodos();
        
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            
        } catch (error) {
            this.todos = originalTodos;
            this.renderTodos();
            this.showError('Failed to delete todo');
        }
    }
    
    renderTodos() {
        this.todoList.innerHTML = '';
        
        if (this.todos.length === 0) {
            this.emptyState.style.display = 'block';
            this.todoList.style.display = 'none';
            return;
        }
        
        this.emptyState.style.display = 'none';
        this.todoList.style.display = 'block';
        
        this.todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                     data-id="${todo.id}" 
                     data-completed="${!todo.completed}"></div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">Delete</button>
            `;
            
            const checkbox = li.querySelector('.todo-checkbox');
            checkbox.addEventListener('click', () => {
                this.toggleTodo(todo.id, !todo.completed);
            });
            
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this todo?')) {
                    this.deleteTodo(todo.id);
                }
            });
            
            this.todoList.appendChild(li);
        });
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    hideError() {
        this.errorMessage.style.display = 'none';
    }
    
    setLoading(loading) {
        if (loading) {
            this.todoForm.classList.add('loading');
        } else {
            this.todoForm.classList.remove('loading');
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});