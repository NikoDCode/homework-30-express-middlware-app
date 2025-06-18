import express from 'express'
import { validateArticle, validateArticleUpdate, validateArticleDelete } from '../validators/articleValidation.mjs'
import { checkArticleAccess } from '../middleware/checkArticleAccess.mjs'

const router = express.Router()

// GET /articles - список статей
router.get('/', (req, res) => {
  res.render('articles', { 
    title: 'Список статей'
  })
})

// GET /articles/:id - детали статьи
router.get('/:id', (req, res) => {
  res.render('articleDetails', { 
    title: 'Детали статьи', 
    articleId: req.params.id
  })
})

// POST /articles - создание статьи (требует прав администратора)
router.post('/', checkArticleAccess, validateArticle, (req, res) => {
  // Здесь будет логика создания статьи
  res.status(201).json({ message: 'Статья создана' })
})

// PUT /articles/:articleId - обновление статьи (требует прав администратора)
router.put('/:articleId', checkArticleAccess, validateArticleUpdate, (req, res) => {
  // Здесь будет логика обновления статьи
  res.json({ message: 'Статья обновлена' })
})

// DELETE /articles/:articleId - удаление статьи (требует прав администратора)
router.delete('/:articleId', checkArticleAccess, validateArticleDelete, (req, res) => {
  // Здесь будет логика удаления статьи
  res.json({ message: 'Статья удалена' })
})

export default router