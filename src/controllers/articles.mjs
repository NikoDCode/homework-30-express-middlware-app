// Контроллер для отображения списка статей
const getArticlesHandler = (req, res) => {
  const articles = [
    { id: 1, title: 'Article 1', content: 'Content of article 1' },
    { id: 2, title: 'Article 2', content: 'Content of article 2' }
  ]
  // Явно указываем использование EJS
  res.render('ejs/articles.ejs', { articles })
}

// Контроллер для создания новой статьи
const postArticlesHandler = (req, res) => {
  const { title, content } = req.body
  
  // Здесь должна быть логика сохранения в базу данных
  const newArticle = {
    id: Date.now(), // Временный ID
    title,
    content
  }
  
  // Возвращаем JSON ответ о успешном создании
  res.status(201).json({
    status: 'success',
    message: 'Article created successfully',
    article: newArticle
  })
}

// Контроллер для отображения конкретной статьи
const getArticleByIdHandler = (req, res) => {
  const article = { 
    id: req.params.articleId, 
    title: `Article ${req.params.articleId}`, 
    content: `Content of article ${req.params.articleId}` 
  }
  // Явно указываем использование EJS
  res.render('ejs/articleDetails.ejs', { article })
}

// Контроллер для обновления статьи
const putArticleByIdHandler = (req, res) => {
  const { articleId } = req.params
  const { title, content } = req.body
  
  // Здесь должна быть логика обновления в базе данных
  const updatedArticle = {
    id: articleId,
    title,
    content
  }
  
  // Возвращаем JSON ответ об успешном обновлении
  res.json({
    status: 'success',
    message: `Article ${articleId} updated successfully`,
    article: updatedArticle
  })
}

// Контроллер для удаления статьи
const deleteArticleByIdHandler = (req, res) => {
  const { articleId } = req.params
  
  // Здесь должна быть логика удаления из базы данных
  
  // Возвращаем JSON ответ об успешном удалении
  res.json({
    status: 'success',
    message: `Article ${articleId} deleted successfully`
  })
}

export {
  getArticlesHandler,
  postArticlesHandler,
  getArticleByIdHandler,
  putArticleByIdHandler,
  deleteArticleByIdHandler
}