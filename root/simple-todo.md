---
language: javascript
code_target: ./apps/simple-todo
code_repo: https://github.com/ryancopley/sdd-test
test_command: npm test
role: root
---

# Simple Todo Application

## What I Want
I need a basic todo list web application where users can manage their daily tasks.

## User Stories
- As a user, I want to add new todos by typing and pressing enter
- As a user, I want to see all my todos in a clean list
- As a user, I want to mark todos as complete by clicking them
- As a user, I want to delete todos I no longer need
- As a user, I want my todos to persist when I refresh the page

## Requirements
- Web application accessible via browser
- Simple, clean interface - no login required
- Data should persist between sessions
- Should work on desktop browsers
- Fast and responsive

## Technical Preferences
- Use Node.js for the backend
- Simple database (SQLite is fine)
- Modern but simple frontend (no framework needed)
- RESTful API design
- Standard HTTP port

#include shared/basic-validation.md
