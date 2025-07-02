import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Индексы для оптимизации запросов
articleSchema.index({ title: 'text', content: 'text' })
articleSchema.index({ author: 1, publishedAt: -1 })
articleSchema.index({ status: 1, publishedAt: -1 })

// Виртуальное поле для краткого описания
articleSchema.virtual('excerpt').get(function() {
  return this.content.length > 150 
    ? this.content.substring(0, 150) + '...' 
    : this.content
})

// Метод для получения публичных данных статьи
articleSchema.methods.toPublicJSON = function() {
  const article = this.toObject()
  return {
    id: article._id,
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    tags: article.tags,
    status: article.status,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt
  }
}

export default mongoose.model('Article', articleSchema) 