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

articlesRouter.route('/').get(getArticlesHandler).post(postArticlesHandler)

articlesRouter
  .route('/:articleId')
  .get(getArticleByIdHandler)
  .put(putArticleByIdHandler)
  .delete(deleteArticleByIdHandler)

export default articlesRouter