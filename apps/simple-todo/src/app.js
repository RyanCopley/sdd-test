const validateTodoText = (req, res, next) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Todo text is required and must be a string'
    });
  }
  
  const trimmedText = text.trim();
  
  if (trimmedText.length === 0) {
    return res.status(400).json({
      error: 'Todo text cannot be empty or just whitespace'
    });
  }
  
  if (trimmedText.length > 500) {
    return res.status(400).json({
      error: 'Todo text cannot exceed 500 characters'
    });
  }
  
  // Update the request body with trimmed text
  req.body.text = trimmedText;
  next();
};

const validateTodoUpdate = (req, res, next) => {
  const { text, completed } = req.body;
  
  if (text !== undefined) {
    if (typeof text !== 'string') {
      return res.status(400).json({
        error: 'Todo text must be a string'
      });
    }
    
    const trimmedText = text.trim();
    
    if (trimmedText.length === 0) {
      return res.status(400).json({
        error: 'Todo text cannot be empty or just whitespace'
      });
    }
    
    if (trimmedText.length > 500) {
      return res.status(400).json({
        error: 'Todo text cannot exceed 500 characters'
      });
    }
    
    req.body.text = trimmedText;
  }
  
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      error: 'Completed status must be a boolean'
    });
  }
  
  next();
};

const validateTodoId = (req, res, next) => {
  const { id } = req.params;
  const todoId = parseInt(id, 10);
  
  if (isNaN(todoId) || todoId <= 0) {
    return res.status(400).json({
      error: 'Invalid todo ID'
    });
  }
  
  req.params.id = todoId;
  next();
};

module.exports = {
  validateTodoText,
  validateTodoUpdate,
  validateTodoId
};