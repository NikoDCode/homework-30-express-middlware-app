import { Router } from 'express'
import {
  getUsersHandler,
  postUsersHandler,
  getUserByIdHandler,
  putUserByIdHandler,
  deleteUserByIdHandler
} from '../controllers/users.mjs'
import { validateUserBody, validateParamsUserId } from '../validators/userValidation.mjs'

const usersRouter = Router()

// Маршрут для отображения списка пользователей с использованием PUG
usersRouter.get('/', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ]
  // Явно указываем использование PUG
  res.render('pug/users.pug', { users })
})

// Маршрут для отображения деталей пользователя с использованием PUG
usersRouter.get('/:userId', validateParamsUserId, (req, res) => {
  const user = { 
    id: req.params.userId, 
    name: 'John Doe', 
    email: 'john@example.com' 
  }
  // Явно указываем использование PUG
  res.render('pug/userDetails.pug', { user })
})

usersRouter
  .route('/')
  .post(validateUserBody, postUsersHandler)

usersRouter
  .route('/:userId')
  .put(validateParamsUserId, validateUserBody, putUserByIdHandler)
  .delete(validateParamsUserId, deleteUserByIdHandler)

export default usersRouter