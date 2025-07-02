import express from 'express'
import { validateUser, validateUserUpdate, validateUserDelete } from '../validators/userValidation.mjs'
import { UserService } from '../services/userService.mjs'

const router = express.Router()

// GET /users - список пользователей
router.get('/', async (req, res) => {
  try {
    const users = await UserService.getAllUsers()
    res.render('users', { 
      title: 'Список пользователей',
      users: users
    })
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении пользователей',
      message: error.message 
    })
  }
})

// GET /users/:id - детали пользователя
router.get('/:id', async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id)
    res.render('userDetails', { 
      title: 'Детали пользователя', 
      user: user
    })
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error)
    res.status(404).json({ 
      error: 'Пользователь не найден',
      message: error.message 
    })
  }
})

// POST /users - создание пользователя
router.post('/', validateUser, async (req, res) => {
  try {
    const newUser = await UserService.createUser(req.body)
    res.status(201).json({ 
      message: 'Пользователь создан',
      user: newUser
    })
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error)
    res.status(400).json({ 
      error: 'Ошибка при создании пользователя',
      message: error.message 
    })
  }
})

// PUT /users/:id - обновление пользователя
router.put('/:id', validateUserUpdate, async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body)
    res.json({ 
      message: 'Пользователь обновлен',
      user: updatedUser
    })
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error)
    res.status(400).json({ 
      error: 'Ошибка при обновлении пользователя',
      message: error.message 
    })
  }
})

// DELETE /users/:id - удаление пользователя
router.delete('/:id', validateUserDelete, async (req, res) => {
  try {
    const result = await UserService.deleteUser(req.params.id)
    res.json(result)
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error)
    res.status(400).json({ 
      error: 'Ошибка при удалении пользователя',
      message: error.message 
    })
  }
})

export default router