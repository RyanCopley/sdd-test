#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✓ ${message}`);
        testsPassed++;
    } else {
        console.error(`✗ ${message}`);
        testsFailed++;
    }
}

function createMockDOM() {
    const mockElements = {
        todoInput: { 
            value: '', 
            addEventListener: () => {},
            focus: () => {}
        },
        todoList: { 
            innerHTML: '', 
            appendChild: (elem) => {
                mockElements.todoList.children = mockElements.todoList.children || [];
                mockElements.todoList.children.push(elem);
            },
            children: []
        },
        emptyState: { 
            style: { display: '' }
        },
        stats: {},
        totalTodos: { textContent: '' },
        completedTodos: { textContent: '' },
        pendingTodos: { textContent: '' }
    };
    
    global.document = {
        getElementById: function(id) {
            return mockElements[id] || null;
        },
        createElement: function(tagName) {
            return {
                tagName: tagName.toUpperCase(),
                className: '',
                innerHTML: '',
                textContent: '',
                style: {},
                appendChild: () => {},
                setAttribute: () => {},
                getAttribute: () => null,
                click: () => {}
            };
        },
        addEventListener: () => {},
        body: {
            classList: {
                add: () => {},
                remove: () => {},
                contains: () => false
            }
        }
    };
    
    global.localStorage = {
        data: {},
        getItem: function(key) {
            return this.data[key] || null;
        },
        setItem: function(key, value) {
            this.data[key] = value;
        },
        removeItem: function(key) {
            delete this.data[key];
        },
        clear: function() {
            this.data = {};
        }
    };
    
    global.alert = function(message) {
        console.log('Alert:', message);
    };
    
    global.confirm = function(message) {
        return true;
    };
    
    return mockElements;
}

function runTests() {
    console.log('Running TodoApp Tests...\n');
    
    try {
        const mockElements = createMockDOM();
        
        localStorage.clear();
        
        const { TodoApp } = require('./todo-app.js');
        const app = new TodoApp();
        
        app.todoInput = mockElements.todoInput;
        app.todoList = mockElements.todoList;
        app.emptyState = mockElements.emptyState;
        app.stats = mockElements.stats;
        
        assert(Array.isArray(app.todos), 'TodoApp initializes with empty todos array');
        assert(app.todos.length === 0, 'Initial todos array is empty');
        assert(app.konamiCode.length === 10, 'Konami code has correct length');
        assert(app.rainbowMode === false, 'Rainbow mode starts as false');
        
        app.todoInput.value = 'Test Todo';
        app.addTodo();
        assert(app.todos.length === 1, 'Adding todo increases todos count');
        assert(app.todos[0].text === 'Test Todo', 'Todo text is saved correctly');
        assert(app.todos[0].completed === false, 'New todo is not completed by default');
        assert(typeof app.todos[0].id === 'string', 'Todo has string ID');
        assert(typeof app.todos[0].createdAt === 'string', 'Todo has creation timestamp');
        
        const todoId = app.todos[0].id;
        app.toggleTodo(todoId);
        assert(app.todos[0].completed === true, 'Toggle todo marks as completed');
        
        app.toggleTodo(todoId);
        assert(app.todos[0].completed === false, 'Toggle todo marks as incomplete');
        
        app.todoInput.value = '   ';
        const initialLength = app.todos.length;
        app.addTodo();
        assert(app.todos.length === initialLength, 'Empty/whitespace todo is not added');
        
        app.todoInput.value = 'Second Todo';
        app.addTodo();
        assert(app.todos.length === 2, 'Second todo is added');
        assert(app.todos[0].text === 'Second Todo', 'New todos are added to the front');
        
        const escapedHtml = app.escapeHtml('<script>alert("xss")</script>');
        assert(!escapedHtml.includes('<script>'), 'HTML is properly escaped');
        
        app.todos = [
            { id: '1', text: 'Todo 1', completed: false },
            { id: '2', text: 'Todo 2', completed: true },
            { id: '3', text: 'Todo 3', completed: false }
        ];
        
        app.updateStats();
        assert(mockElements.totalTodos.textContent == 3, 'Total todos count is correct');
        assert(mockElements.completedTodos.textContent == 1, 'Completed todos count is correct');
        assert(mockElements.pendingTodos.textContent == 2, 'Pending todos count is correct');
        
        const initialTodoCount = app.todos.length;
        app.deleteTodo('2');
        assert(app.todos.length === initialTodoCount - 1, 'Delete todo removes from array');
        assert(!app.todos.find(t => t.id === '2'), 'Deleted todo is not found in array');
        
        app.todos = [
            { id: '1', text: 'Test', completed: false, createdAt: '2023-01-01' },
            { id: '2', text: 'Test2', completed: true, createdAt: '2023-01-02' }
        ];
        
        const exportedData = JSON.stringify(app.todos, null, 2);
        assert(exportedData.includes('Test'), 'Export includes todo data');
        assert(exportedData.includes('Test2'), 'Export includes all todos');
        
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        app.konamiIndex = 0;
        app.rainbowMode = false;
        
        for (let i = 0; i < konamiSequence.length - 1; i++) {
            app.checkKonamiCode(konamiSequence[i]);
        }
        assert(app.rainbowMode === false, 'Rainbow mode not activated before complete sequence');
        
        app.checkKonamiCode(konamiSequence[konamiSequence.length - 1]);
        assert(app.rainbowMode === true, 'Rainbow mode activated after complete Konami code');
        
        app.toggleRainbowMode();
        assert(app.rainbowMode === false, 'Rainbow mode can be toggled off');
        
        app.checkKonamiCode(999);
        assert(app.konamiIndex === 0, 'Wrong key resets Konami code index');
        
        const savedTodos = app.loadTodos();
        assert(Array.isArray(savedTodos), 'loadTodos returns an array');
        
        console.log(`\n--- Test Results ---`);
        console.log(`Tests passed: ${testsPassed}`);
        console.log(`Tests failed: ${testsFailed}`);
        
        if (testsFailed === 0) {
            console.log('All tests passed! ✅');
            process.exit(0);
        } else {
            console.log('Some tests failed! ❌');
            process.exit(1);
        }
        
    } catch (error) {
        console.error('Test execution failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    runTests();
}

module.exports = { runTests };