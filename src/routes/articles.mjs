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
    return res.status(403).json({
      status: 'error',
      code: 403,
      message: 'Access denied. Insufficient permissions.'
    })
  }
  next()
}

// Применение middleware для всех маршрутов статей
articlesRouter.use(checkArticleAccess)

// Используем контроллеры для маршрутов
articlesRouter.get('/', getArticlesHandler)
articlesRouter.get('/:articleId', getArticleByIdHandler)

// CRUD операции
articlesRouter.route('/').post(postArticlesHandler)

articlesRouter
  .route('/:articleId')
  .put(putArticleByIdHandler)
  .delete(deleteArticleByIdHandler)

export default articlesRouter