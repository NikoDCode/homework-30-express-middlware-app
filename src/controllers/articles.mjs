const getArticlesHandler = (req, res) => {
  res.end('Response from Express articles handler')
}

const postArticlesHandler = (req, res) => {
  res.end('Response from Express post articles handler')
}

const getArticleByIdHandler = (req, res) => {
  res.end(`Response from Express get article by ID handler: ${req.params.articleId}`)
}

const putArticleByIdHandler = (req, res) => {
  res.end(`Response from Express put article by ID handler: ${req.params.articleId}`)
}

const deleteArticleByIdHandler = (req, res) => {
  res.end(`Response from Express delete article by ID handler: ${req.params.articleId}`)
}

export {
  getArticlesHandler,
  postArticlesHandler,
  getArticleByIdHandler,
  putArticleByIdHandler,
  deleteArticleByIdHandler
}