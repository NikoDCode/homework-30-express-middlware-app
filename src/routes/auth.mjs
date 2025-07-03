import express from 'express'
import passport from '../middleware/passport.mjs'
import bcrypt from 'bcryptjs'
import { validateRegistration, validateLogin } from '../validators/authValidation.mjs'
import { UserService } from '../services/userService.mjs'

const router = express.Router()

// Регистрация
router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    // Проверка существования пользователя
    const existingUser = await UserService.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь уже существует' })
    }
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)
    // Создаем пользователя через UserService
    const newUser = await UserService.createUser({ email, password: hashedPassword, name })
    // Получаем пользователя из базы для логина
    const dbUser = await UserService.getUserByEmail(email)
    req.login(dbUser, (err) => {
      if (err) {
        return next(err)
      }
      res.status(201).json({ message: 'Регистрация успешна' })
    })
  } catch (error) {
    next(error)
  }
})

// Вход
router.post('/login', validateLogin, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(401).json({ error: info.message })
    }
    req.login(user, (err) => {
      if (err) {
        return next(err)
      }
      res.json({ message: 'Вход выполнен успешно' })
    })
  })(req, res, next)
})

// Выход
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при выходе' })
    }
    res.json({ message: 'Выход выполнен успешно' })
  })
})

// Защищенный маршрут
router.get('/protected', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Требуется авторизация' })
  }
  res.json({ 
    message: 'Доступ к защищенному маршруту получен',
    user: req.user
  })
})

export default router 