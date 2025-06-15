import { Router } from 'express'
import rootRouter from './root.mjs'
import usersRouter from './users.mjs'
import articlesRouter from './articles.mjs'
import authRoutes from './auth.mjs'

const router = Router()

router.use('/', rootRouter)
router.use('/users', usersRouter)
router.use('/articles', articlesRouter)

// Маршрут для изменения темы
router.post('/theme', (req, res) => {
  const { theme } = req.body
  res.cookie('theme', theme, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    httpOnly: true
  })
  res.json({ message: 'Тема успешно изменена' })
})

// Подключаем маршруты аутентификации
router.use('/auth', authRoutes)

export default router
