import express from 'express'
import authRouter from './auth.mjs'
import usersRouter from './users.mjs'
import articlesRouter from './articles.mjs'
import rootRouter from './root.mjs'

const router = express.Router()

// Маршрут для смены темы
router.post('/theme', (req, res) => {
  const { theme } = req.body
  
  // Проверяем валидность темы
  if (theme !== 'dark' && theme !== 'light') {
    return res.status(400).json({ 
      error: 'Недопустимое значение темы. Используйте "dark" или "light"' 
    })
  }
  
  // Устанавливаем cookie с темой
  res.cookie('theme', theme, { 
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 дней
  })
  
  res.json({ 
    message: 'Тема успешно изменена',
    theme: theme
  })
})

// Подключаем все маршруты
router.use('/', rootRouter)
router.use('/auth', authRouter)
router.use('/users', usersRouter)
router.use('/articles', articlesRouter)

export default router
