import { Router } from 'express'
import { register, login, logout } from '../controllers/auth.mjs'
import { verifyToken } from '../middleware/auth.mjs'

const router = Router()

// Маршруты аутентификации
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// Защищенный маршрут для примера
router.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user })
})

export default router 