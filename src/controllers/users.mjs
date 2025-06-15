// Контроллер для отображения списка пользователей
const getUsersHandler = (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]
  // Явно указываем использование PUG
  res.render('pug/users.pug', { users })
}

// Контроллер для создания нового пользователя
const postUsersHandler = (req, res) => {
  const { name, email, age } = req.body
  
  // Здесь должна быть логика сохранения в базу данных
  const newUser = {
    id: Date.now(), // Временный ID
    name,
    email,
    age
  }
  
  // Возвращаем JSON ответ о успешном создании
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    user: newUser
  })
}

// Контроллер для отображения конкретного пользователя
const getUserByIdHandler = (req, res) => {
  const user = { 
    id: req.params.userId, 
    name: 'John Doe', 
    email: 'john@example.com' 
  }
  // Явно указываем использование PUG
  res.render('pug/userDetails.pug', { user })
}

// Контроллер для обновления пользователя
const putUserByIdHandler = (req, res) => {
  const { userId } = req.params
  const { name, email, age } = req.body
  
  // Здесь должна быть логика обновления в базе данных
  const updatedUser = {
    id: userId,
    name,
    email,
    age
  }
  
  // Возвращаем JSON ответ об успешном обновлении
  res.json({
    status: 'success',
    message: `User ${userId} updated successfully`,
    user: updatedUser
  })
}

// Контроллер для удаления пользователя
const deleteUserByIdHandler = (req, res) => {
  const { userId } = req.params
  
  // Здесь должна быть логика удаления из базы данных
  
  // Возвращаем JSON ответ об успешном удалении
  res.json({
    status: 'success',
    message: `User ${userId} deleted successfully`
  })
}

export {
  getUsersHandler,
  postUsersHandler,
  getUserByIdHandler,
  putUserByIdHandler,
  deleteUserByIdHandler
}