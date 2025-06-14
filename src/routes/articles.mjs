import { Router } from 'express'
import {
  getArticlesHandler,
  postArticlesHandler,
  getArticleByIdHandler,
  putArticleByIdHandler,
  deleteArticleByIdHandler
} from '../controllers/articles.mjs'

const articlesRouter = Router()

// Middleware для проверки прав доступа
const checkArticleAccess = (req, res, next) => {
  const userRole = req.headers['x-user-role']
  if (userRole !== 'admin') {
    return res.status(403).send('Access denied. Insufficient permissions.')
  }
  next()
}

// Применение middleware для всех маршрутов статей
articlesRouter.use(checkArticleAccess)

// Маршрут для отображения списка статей с использованием EJS
articlesRouter.get('/', (req, res) => {
  const articles = [
    { id: 1, title: 'Article 1', content: 'Content of article 1' },
    { id: 2, title: 'Article 2', content: 'Content of article 2' }
  ]
  // Явно указываем использование EJS
  res.render('ejs/articles.ejs', { articles })
})

// Маршрут для отображения деталей статьи с использованием EJS
articlesRouter.get('/:articleId', (req, res) => {
  const article = { 
    id: req.params.articleId, 
    title: `Article ${req.params.articleId}`, 
    content: `Content of article ${req.params.articleId}` 
  }
  // Явно указываем использование EJS
  res.render('ejs/articleDetails.ejs', { article })
})

articlesRouter.route('/').post(postArticlesHandler)

articlesRouter
  .route('/:articleId')
  .put(putArticleByIdHandler)
  .delete(deleteArticleByIdHandler)

export default articlesRouter