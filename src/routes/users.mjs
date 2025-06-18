import express from 'express'
import { validateUser, validateUserUpdate, validateUserDelete } from '../validators/userValidation.mjs'

const router = express.Router()

// GET /users - список пользователей
router.get('/', (req, res) => {
  res.render('users', { 
    title: 'Список пользователей'
  })
})

// GET /users/:id - детали пользователя
router.get('/:id', (req, res) => {
  res.render('userDetails', { 
    title: 'Детали пользователя', 
    userId: req.params.id
  })
})

// POST /users - создание пользователя
router.post('/', validateUser, (req, res) => {
  // Здесь будет логика создания пользователя
  res.status(201).json({ message: 'Пользователь создан' })
})

// PUT /users/:userId - обновление пользователя
router.put('/:userId', (req, res) => {
  // Здесь будет логика обновления пользователя
  res.json({ message: 'Пользователь обновлен' })
})

// DELETE /users/:userId - удаление пользователя
router.delete('/:userId', validateUserDelete, (req, res) => {
  // Здесь будет логика удаления пользователя
  res.json({ message: 'Пользователь удален' })
})

export default router