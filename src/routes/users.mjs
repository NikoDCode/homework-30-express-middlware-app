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

usersRouter
  .route('/')
  .get(getUsersHandler)
  .post(validateUserBody, postUsersHandler)

usersRouter
  .route('/:userId')
  .get(validateParamsUserId, getUserByIdHandler)
  .put(validateParamsUserId, validateUserBody, putUserByIdHandler)
  .delete(validateParamsUserId, deleteUserByIdHandler)

export default usersRouter