import express from 'express'
import { UserService } from '../services/userService.mjs'
import { ArticleService } from '../services/articleService.mjs'

const router = express.Router()

// GET / - приветственное сообщение с данными из MongoDB
router.get('/', async (req, res) => {
  try {
    // Получаем статистику из базы данных
    const [users, articles, articleStats] = await Promise.all([
      UserService.getAllUsers(),
      ArticleService.getAllArticles(),
      ArticleService.getArticlesStats()
    ])

    res.render('dashboard', {
      title: 'Express Middleware App с MongoDB Atlas',
      users: users.slice(0, 3), // Показываем только первые 3 пользователя
      articles: articles.slice(0, 3), // Показываем только первые 3 статьи
      stats: {
        totalUsers: users.length,
        totalArticles: articleStats.total,
        publishedArticles: articleStats.byStatus.published || 0,
        draftArticles: articleStats.byStatus.draft || 0,
        archivedArticles: articleStats.byStatus.archived || 0
      }
    })
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
    res.send(`
      <h1>Добро пожаловать в Express Middleware App!</h1>
      <p>Приложение успешно запущено.</p>
      <p>Ошибка подключения к базе данных: ${error.message}</p>
      <p>Убедитесь, что MongoDB Atlas настроен правильно.</p>
    `)
  }
})

export default router