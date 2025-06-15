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

// Используем контроллер для отображения списка пользователей
usersRouter.get('/', getUsersHandler)

// Используем контроллер для отображения деталей пользователя
usersRouter.get('/:userId', validateParamsUserId, getUserByIdHandler)

// CRUD операции
usersRouter
  .route('/')
  .post(validateUserBody, postUsersHandler)

usersRouter
  .route('/:userId')
  .put(validateParamsUserId, validateUserBody, putUserByIdHandler)
  .delete(validateParamsUserId, deleteUserByIdHandler)

export default usersRouter