import Article from '../models/Article.mjs'
import User from '../models/User.mjs'

export class ArticleService {
  // Получить все статьи
  static async getAllArticles() {
    try {
      const articles = await Article.find({ status: 'published' })
        .populate('author', 'name email')
        .sort({ publishedAt: -1 })
        .lean()
      
      return articles.map(article => ({
        ...article,
        excerpt: article.content.length > 150 
          ? article.content.substring(0, 150) + '...' 
          : article.content
      }))
    } catch (error) {
      throw new Error(`Ошибка при получении статей: ${error.message}`)
    }
  }

  // Получить статью по ID
  static async getArticleById(id) {
    try {
      const article = await Article.findById(id)
        .populate('author', 'name email')
        .lean()
      
      if (!article) {
        throw new Error('Статья не найдена')
      }

      return {
        ...article,
        excerpt: article.content.length > 150 
          ? article.content.substring(0, 150) + '...' 
          : article.content
      }
    } catch (error) {
      throw new Error(`Ошибка при получении статьи: ${error.message}`)
    }
  }

  // Создать новую статью
  static async createArticle(articleData, authorId) {
    try {
      // Проверяем, что автор существует
      const author = await User.findById(authorId)
      if (!author) {
        throw new Error('Автор не найден')
      }

      const article = new Article({
        title: articleData.title,
        content: articleData.content,
        author: authorId,
        tags: articleData.tags || [],
        status: articleData.status || 'published'
      })

      await article.save()
      
      // Возвращаем статью с данными автора
      const populatedArticle = await Article.findById(article._id)
        .populate('author', 'name email')
        .lean()

      return {
        ...populatedArticle,
        excerpt: populatedArticle.content.length > 150 
          ? populatedArticle.content.substring(0, 150) + '...' 
          : populatedArticle.content
      }
    } catch (error) {
      throw new Error(`Ошибка при создании статьи: ${error.message}`)
    }
  }

  // Обновить статью
  static async updateArticle(id, updateData) {
    try {
      const article = await Article.findById(id)
      if (!article) {
        throw new Error('Статья не найдена')
      }

      if (updateData.title) article.title = updateData.title
      if (updateData.content) article.content = updateData.content
      if (updateData.tags) article.tags = updateData.tags
      if (updateData.status) article.status = updateData.status

      await article.save()
      
      const updatedArticle = await Article.findById(id)
        .populate('author', 'name email')
        .lean()

      return {
        ...updatedArticle,
        excerpt: updatedArticle.content.length > 150 
          ? updatedArticle.content.substring(0, 150) + '...' 
          : updatedArticle.content
      }
    } catch (error) {
      throw new Error(`Ошибка при обновлении статьи: ${error.message}`)
    }
  }

  // Удалить статью
  static async deleteArticle(id) {
    try {
      const article = await Article.findByIdAndDelete(id)
      if (!article) {
        throw new Error('Статья не найдена')
      }
      return { message: 'Статья успешно удалена' }
    } catch (error) {
      throw new Error(`Ошибка при удалении статьи: ${error.message}`)
    }
  }

  // Поиск статей по тегам
  static async getArticlesByTags(tags) {
    try {
      const articles = await Article.find({
        tags: { $in: tags },
        status: 'published'
      })
        .populate('author', 'name email')
        .sort({ publishedAt: -1 })
        .lean()
      
      return articles.map(article => ({
        ...article,
        excerpt: article.content.length > 150 
          ? article.content.substring(0, 150) + '...' 
          : article.content
      }))
    } catch (error) {
      throw new Error(`Ошибка при поиске статей: ${error.message}`)
    }
  }

  // Получить статистику статей
  static async getArticlesStats() {
    try {
      const stats = await Article.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ])
      
      const totalArticles = await Article.countDocuments()
      
      return {
        total: totalArticles,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count
          return acc
        }, {})
      }
    } catch (error) {
      throw new Error(`Ошибка при получении статистики: ${error.message}`)
    }
  }

  // Массовое добавление статей
  static async insertMany(articlesData, authorId) {
    try {
      const articles = articlesData.map(data => ({
        ...data,
        author: authorId,
        status: data.status || 'published'
      }))
      const result = await Article.insertMany(articles)
      return result
    } catch (error) {
      throw new Error(`Ошибка при массовом добавлении статей: ${error.message}`)
    }
  }

  // Массовое обновление статей
  static async updateMany(filter, update) {
    try {
      const result = await Article.updateMany(filter, update)
      return result
    } catch (error) {
      throw new Error(`Ошибка при массовом обновлении статей: ${error.message}`)
    }
  }

  // Замена одной статьи
  static async replaceOne(id, newData) {
    try {
      const replaced = await Article.findOneAndReplace({ _id: id }, newData, { new: true })
      if (!replaced) throw new Error('Статья не найдена для замены')
      return replaced
    } catch (error) {
      throw new Error(`Ошибка при замене статьи: ${error.message}`)
    }
  }

  // Массовое удаление статей
  static async deleteMany(filter) {
    try {
      const result = await Article.deleteMany(filter)
      return result
    } catch (error) {
      throw new Error(`Ошибка при массовом удалении статей: ${error.message}`)
    }
  }

  // Поиск с проекцией
  static async findWithProjection(filter, projection) {
    try {
      const articles = await Article.find(filter, projection)
      return articles
    } catch (error) {
      throw new Error(`Ошибка при поиске статей с проекцией: ${error.message}`)
    }
  }
} 