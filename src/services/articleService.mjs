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

  // Получить курсор для всех статей (для обработки больших объемов данных)
  static getArticlesCursor(filter = { status: 'published' }, options = {}) {
    try {
      return Article.find(filter)
        .populate('author', 'name email')
        .sort({ publishedAt: -1 })
        .cursor(options)
    } catch (error) {
      throw new Error(`Ошибка при создании курсора: ${error.message}`)
    }
  }

  // Обработать статьи через курсор с пакетной обработкой
  static async processArticlesWithCursor(batchSize = 10, processor) {
    try {
      const cursor = this.getArticlesCursor()
      const results = []
      let batch = []
      let processedCount = 0

      for (let article = await cursor.next(); article != null; article = await cursor.next()) {
        batch.push(article)
        processedCount++

        if (batch.length >= batchSize) {
          const batchResult = await processor(batch, processedCount)
          results.push(batchResult)
          batch = []
        }
      }

      // Обработать оставшиеся статьи
      if (batch.length > 0) {
        const batchResult = await processor(batch, processedCount)
        results.push(batchResult)
      }

      await cursor.close()
      return { results, totalProcessed: processedCount }
    } catch (error) {
      throw new Error(`Ошибка при обработке статей через курсор: ${error.message}`)
    }
  }

  // Получить курсор для статей с фильтрацией по тегам
  static getArticlesByTagsCursor(tags, options = {}) {
    try {
      return Article.find({
        tags: { $in: tags },
        status: 'published'
      })
        .populate('author', 'name email')
        .sort({ publishedAt: -1 })
        .cursor(options)
    } catch (error) {
      throw new Error(`Ошибка при создании курсора для тегов: ${error.message}`)
    }
  }

  // Расширенная статистика статей с детальной аналитикой
  static async getAdvancedArticlesStats() {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorInfo'
          }
        },
        {
          $unwind: '$authorInfo'
        },
        {
          $group: {
            _id: {
              status: '$status',
              authorRole: '$authorInfo.role'
            },
            count: { $sum: 1 },
            avgContentLength: { $avg: { $strLenCP: '$content' } },
            totalContentLength: { $sum: { $strLenCP: '$content' } },
            uniqueTags: { $addToSet: '$tags' }
          }
        },
        {
          $group: {
            _id: '$_id.status',
            authorStats: {
              $push: {
                role: '$_id.authorRole',
                count: '$count',
                avgContentLength: '$avgContentLength',
                totalContentLength: '$totalContentLength'
              }
            },
            totalCount: { $sum: '$count' },
            allTags: { $addToSet: '$uniqueTags' }
          }
        },
        {
          $project: {
            status: '$_id',
            authorStats: 1,
            totalCount: 1,
            uniqueTagsCount: { $size: { $reduce: { input: '$allTags', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } } }
          }
        }
      ]

      const stats = await Article.aggregate(pipeline)
      
      // Дополнительная статистика по тегам
      const tagStats = await Article.aggregate([
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])

      // Статистика по месяцам
      const monthlyStats = await Article.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$publishedAt' },
              month: { $month: '$publishedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])

      return {
        byStatus: stats,
        topTags: tagStats,
        monthlyTrend: monthlyStats,
        summary: {
          totalArticles: stats.reduce((sum, stat) => sum + stat.totalCount, 0),
          totalTags: tagStats.length,
          averageContentLength: stats.reduce((sum, stat) => {
            const avgLength = stat.authorStats.reduce((acc, author) => acc + author.avgContentLength, 0) / stat.authorStats.length
            return sum + avgLength
          }, 0) / stats.length
        }
      }
    } catch (error) {
      throw new Error(`Ошибка при получении расширенной статистики: ${error.message}`)
    }
  }

  // Агрегационный запрос для анализа активности авторов
  static async getAuthorActivityStats() {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'authorInfo'
          }
        },
        {
          $unwind: '$authorInfo'
        },
        {
          $group: {
            _id: '$author',
            authorName: { $first: '$authorInfo.name' },
            authorEmail: { $first: '$authorInfo.email' },
            authorRole: { $first: '$authorInfo.role' },
            totalArticles: { $sum: 1 },
            publishedArticles: {
              $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] }
            },
            draftArticles: {
              $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
            },
            archivedArticles: {
              $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
            },
            totalContentLength: { $sum: { $strLenCP: '$content' } },
            avgContentLength: { $avg: { $strLenCP: '$content' } },
            uniqueTags: { $addToSet: '$tags' },
            firstArticle: { $min: '$publishedAt' },
            lastArticle: { $max: '$publishedAt' }
          }
        },
        {
          $project: {
            authorName: 1,
            authorEmail: 1,
            authorRole: 1,
            totalArticles: 1,
            publishedArticles: 1,
            draftArticles: 1,
            archivedArticles: 1,
            totalContentLength: 1,
            avgContentLength: 1,
            uniqueTagsCount: { $size: { $reduce: { input: '$uniqueTags', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } } },
            firstArticle: 1,
            lastArticle: 1,
            activityPeriod: {
              $divide: [
                { $subtract: ['$lastArticle', '$firstArticle'] },
                1000 * 60 * 60 * 24 // дни
              ]
            }
          }
        },
        { $sort: { totalArticles: -1 } }
      ]

      return await Article.aggregate(pipeline)
    } catch (error) {
      throw new Error(`Ошибка при получении статистики активности авторов: ${error.message}`)
    }
  }

  // Агрегационный запрос для анализа популярности тегов
  static async getTagPopularityStats() {
    try {
      const pipeline = [
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 },
            articles: { $addToSet: '$_id' },
            avgContentLength: { $avg: { $strLenCP: '$content' } },
            statusDistribution: {
              $push: '$status'
            }
          }
        },
        {
          $project: {
            tag: '$_id',
            count: 1,
            articlesCount: { $size: '$articles' },
            avgContentLength: 1,
            statusDistribution: 1,
            publishedCount: {
              $size: {
                $filter: {
                  input: '$statusDistribution',
                  cond: { $eq: ['$$this', 'published'] }
                }
              }
            },
            draftCount: {
              $size: {
                $filter: {
                  input: '$statusDistribution',
                  cond: { $eq: ['$$this', 'draft'] }
                }
              }
            },
            archivedCount: {
              $size: {
                $filter: {
                  input: '$statusDistribution',
                  cond: { $eq: ['$$this', 'archived'] }
                }
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]

      return await Article.aggregate(pipeline)
    } catch (error) {
      throw new Error(`Ошибка при получении статистики популярности тегов: ${error.message}`)
    }
  }
} 