---
language: html
code_target: ./apps/simple-todo
code_repo: https://github.com/ryancopley/sdd-test
test_command: echo "none"
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
- As a user, I want my todos to be exportable so that I can use them in other tools via a JSON export.
- As a user, I want a secret "rainbow" mode that makes the background a rainbow if the user types in the konami code.

## Requirements
- Web application accessible via browser
- Simple, clean interface - no login required
- Is just an HTML file, no backend server.
- Just a single file output. (index.html)
- Data should persist between sessions using localstorage
- Should work on desktop browsers
- Fast and responsive
