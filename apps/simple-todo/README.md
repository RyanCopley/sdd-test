<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Todo App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Simple Todo</h1>
            <p>Stay organized and get things done</p>
        </header>

        <main>
            <div class="add-todo">
                <input 
                    type="text" 
                    id="todoInput" 
                    placeholder="Add a new todo..." 
                    maxlength="500"
                    autocomplete="off"
                >
                <button id="addBtn">Add</button>
            </div>

            <div class="todo-stats">
                <span id="todoCount">0 todos</span>
                <span id="completedCount">0 completed</span>
            </div>

            <div class="todo-list" id="todoList">
                <div class="empty-state" id="emptyState">
                    <p>No todos yet. Add one above to get started!</p>
                </div>
            </div>
        </main>

        <footer>
            <p>Simple Todo App - Keep it simple, get it done</p>
        </footer>
    </div>

    <script src="app.js"></script>
</body>
</html>