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

// ===== НОВЫЕ МАРШРУТЫ ДЛЯ РАБОТЫ С КУРСОРАМИ =====

// GET /articles/cursor - получение статей через курсор (для больших объемов данных)
router.get('/cursor', async (req, res) => {
  try {
    const { limit = 50, status = 'published' } = req.query
    const filter = { status }
    
    const cursor = ArticleService.getArticlesCursor(filter, { limit: parseInt(limit) })
    const articles = []
    
    // Обрабатываем документы по одному через курсор
    for (let article = await cursor.next(); article != null; article = await cursor.next()) {
      articles.push({
        ...article.toObject(),
        excerpt: article.content.length > 150 
          ? article.content.substring(0, 150) + '...' 
          : article.content
      })
    }
    
    await cursor.close()
    
    res.json({
      message: 'Статьи получены через курсор',
      count: articles.length,
      articles: articles
    })
  } catch (error) {
    console.error('Ошибка при получении статей через курсор:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении статей через курсор',
      message: error.message 
    })
  }
})

// POST /articles/cursor/process - пакетная обработка статей через курсор
router.post('/cursor/process', async (req, res) => {
  try {
    const { batchSize = 10, operation = 'analyze' } = req.body
    
    // Определяем функцию обработки в зависимости от операции
    let processor
    switch (operation) {
      case 'analyze':
        processor = async (batch, processedCount) => {
          return {
            batchNumber: Math.ceil(processedCount / batchSize),
            count: batch.length,
            avgContentLength: batch.reduce((sum, article) => sum + article.content.length, 0) / batch.length,
            tags: [...new Set(batch.flatMap(article => article.tags))],
            statuses: [...new Set(batch.map(article => article.status))]
          }
        }
        break
      case 'export':
        processor = async (batch, processedCount) => {
          return {
            batchNumber: Math.ceil(processedCount / batchSize),
            count: batch.length,
            articles: batch.map(article => ({
              id: article._id,
              title: article.title,
              excerpt: article.content.substring(0, 150) + '...',
              author: article.author?.name || 'Unknown',
              tags: article.tags,
              status: article.status,
              publishedAt: article.publishedAt
            }))
          }
        }
        break
      default:
        throw new Error('Неизвестная операция')
    }
    
    const result = await ArticleService.processArticlesWithCursor(parseInt(batchSize), processor)
    
    res.json({
      message: 'Обработка через курсор завершена',
      operation: operation,
      batchSize: parseInt(batchSize),
      totalProcessed: result.totalProcessed,
      batches: result.results.length,
      results: result.results
    })
  } catch (error) {
    console.error('Ошибка при обработке статей через курсор:', error)
    res.status(500).json({ 
      error: 'Ошибка при обработке статей через курсор',
      message: error.message 
    })
  }
})

// GET /articles/cursor/tags/:tag - получение статей по тегу через курсор
router.get('/cursor/tags/:tag', async (req, res) => {
  try {
    const { limit = 50 } = req.query
    const tag = req.params.tag
    
    const cursor = ArticleService.getArticlesByTagsCursor([tag], { limit: parseInt(limit) })
    const articles = []
    
    for (let article = await cursor.next(); article != null; article = await cursor.next()) {
      articles.push({
        ...article.toObject(),
        excerpt: article.content.length > 150 
          ? article.content.substring(0, 150) + '...' 
          : article.content
      })
    }
    
    await cursor.close()
    
    res.json({
      message: 'Статьи по тегу получены через курсор',
      tag: tag,
      count: articles.length,
      articles: articles
    })
  } catch (error) {
    console.error('Ошибка при получении статей по тегу через курсор:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении статей по тегу через курсор',
      message: error.message 
    })
  }
})

// ===== НОВЫЕ МАРШРУТЫ ДЛЯ АГРЕГАЦИОННЫХ ЗАПРОСОВ =====

// GET /articles/stats/advanced - расширенная статистика с агрегационными запросами
router.get('/stats/advanced', async (req, res) => {
  try {
    const stats = await ArticleService.getAdvancedArticlesStats()
    res.json({
      message: 'Расширенная статистика получена',
      stats: stats
    })
  } catch (error) {
    console.error('Ошибка при получении расширенной статистики:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении расширенной статистики',
      message: error.message 
    })
  }
})

// GET /articles/stats/authors - статистика активности авторов
router.get('/stats/authors', async (req, res) => {
  try {
    const stats = await ArticleService.getAuthorActivityStats()
    res.json({
      message: 'Статистика активности авторов получена',
      authors: stats
    })
  } catch (error) {
    console.error('Ошибка при получении статистики авторов:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении статистики авторов',
      message: error.message 
    })
  }
})

// GET /articles/stats/tags - статистика популярности тегов
router.get('/stats/tags', async (req, res) => {
  try {
    const stats = await ArticleService.getTagPopularityStats()
    res.json({
      message: 'Статистика популярности тегов получена',
      tags: stats
    })
  } catch (error) {
    console.error('Ошибка при получении статистики тегов:', error)
    res.status(500).json({ 
      error: 'Ошибка при получении статистики тегов',
      message: error.message 
    })
  }
})

// POST /articles/stats/custom - кастомный агрегационный запрос
router.post('/stats/custom', async (req, res) => {
  try {
    const { pipeline } = req.body
    
    if (!pipeline || !Array.isArray(pipeline)) {
      return res.status(400).json({
        error: 'Неверный формат pipeline. Ожидается массив этапов агрегации'
      })
    }
    
    // Безопасность: ограничиваем сложные операции
    if (pipeline.length > 10) {
      return res.status(400).json({
        error: 'Слишком сложный pipeline. Максимум 10 этапов'
      })
    }
    
    const result = await Article.aggregate(pipeline)
    
    res.json({
      message: 'Кастомный агрегационный запрос выполнен',
      pipeline: pipeline,
      result: result,
      count: result.length
    })
  } catch (error) {
    console.error('Ошибка при выполнении кастомного агрегационного запроса:', error)
    res.status(500).json({ 
      error: 'Ошибка при выполнении кастомного агрегационного запроса',
      message: error.message 
    })
  }
})

export default router