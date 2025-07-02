import express from 'express'
import { validateArticle, validateArticleUpdate, validateArticleDelete } from '../validators/articleValidation.mjs'
import { checkArticleAccess } from '../middleware/checkArticleAccess.mjs'
import { ArticleService } from '../services/articleService.mjs'

const router = express.Router()

// GET /articles - список статей
router.get('/', async (req, res) => {
  try {
    const articles = await ArticleService.getAllArticles()
    res.render('articles', { 
      title: 'Список статей',
      articles: articles
    })
  } catch (error) {
    console.error('Ошибка при получении статей:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении статей',
      message: error.message 
    })
  }
})

// GET /articles/:id - детали статьи
router.get('/:id', async (req, res) => {
  try {
    const article = await ArticleService.getArticleById(req.params.id)
    res.render('articleDetails', { 
      title: 'Детали статьи', 
      article: article
    })
  } catch (error) {
    console.error('Ошибка при получении статьи:', error)
    res.status(404).json({ 
      error: 'Статья не найдена',
      message: error.message 
    })
  }
})

// POST /articles - создание статьи (требует прав администратора)
router.post('/', checkArticleAccess, validateArticle, async (req, res) => {
  try {
    // В реальном приложении authorId должен браться из сессии пользователя
    const authorId = req.headers['x-user-id'] || '507f1f77bcf86cd799439011' // Временный ID для демонстрации
    const newArticle = await ArticleService.createArticle(req.body, authorId)
    res.status(201).json({ 
      message: 'Статья создана',
      article: newArticle
    })
  } catch (error) {
    console.error('Ошибка при создании статьи:', error)
    res.status(400).json({ 
      error: 'Ошибка при создании статьи',
      message: error.message 
    })
  }
})

// PUT /articles/:id - обновление статьи (требует прав администратора)
router.put('/:id', checkArticleAccess, validateArticleUpdate, async (req, res) => {
  try {
    const updatedArticle = await ArticleService.updateArticle(req.params.id, req.body)
    res.json({ 
      message: 'Статья обновлена',
      article: updatedArticle
    })
  } catch (error) {
    console.error('Ошибка при обновлении статьи:', error)
    res.status(400).json({ 
      error: 'Ошибка при обновлении статьи',
      message: error.message 
    })
  }
})

// DELETE /articles/:id - удаление статьи (требует прав администратора)
router.delete('/:id', checkArticleAccess, validateArticleDelete, async (req, res) => {
  try {
    const result = await ArticleService.deleteArticle(req.params.id)
    res.json(result)
  } catch (error) {
    console.error('Ошибка при удалении статьи:', error)
    res.status(400).json({ 
      error: 'Ошибка при удалении статьи',
      message: error.message 
    })
  }
})

// GET /articles/tags/:tag - поиск статей по тегу
router.get('/tags/:tag', async (req, res) => {
  try {
    const articles = await ArticleService.getArticlesByTags([req.params.tag])
    res.json({
      tag: req.params.tag,
      articles: articles,
      count: articles.length
    })
  } catch (error) {
    console.error('Ошибка при поиске статей по тегу:', error)
    res.status(500).json({ 
      error: 'Ошибка при поиске статей',
      message: error.message 
    })
  }
})

// GET /articles/stats/statistics - статистика статей
router.get('/stats/statistics', async (req, res) => {
  try {
    const stats = await ArticleService.getArticlesStats()
    res.json(stats)
  } catch (error) {
    console.error('Ошибка при получении статистики:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении статистики',
      message: error.message 
    })
  }
})

export default router