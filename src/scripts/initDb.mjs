import { connectDB } from '../config/database.mjs'
import User from '../models/User.mjs'
import Article from '../models/Article.mjs'

const initializeDatabase = async () => {
  try {
    console.log('🔄 Подключение к MongoDB Atlas...')
    await connectDB()
    
    console.log('🧹 Очистка существующих данных...')
    await User.deleteMany({})
    await Article.deleteMany({})
    
    console.log('👥 Создание тестовых пользователей...')
    const users = await User.create([
      {
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Администратор',
        role: 'admin'
      },
      {
        email: 'user1@example.com',
        password: 'user123',
        name: 'Иван Петров',
        role: 'user'
      },
      {
        email: 'user2@example.com',
        password: 'user123',
        name: 'Мария Сидорова',
        role: 'user'
      }
    ])
    
    console.log('📝 Создание тестовых статей...')
    const articles = await Article.create([
      {
        title: 'Введение в Express.js',
        content: 'Express.js - это минималистичный и гибкий веб-фреймворк для Node.js, который предоставляет широкий набор функций для веб-приложений и мобильных приложений. Express упрощает создание API и веб-приложений, предоставляя множество полезных HTTP-утилит и middleware для быстрого создания надежных API.',
        author: users[0]._id,
        tags: ['express', 'nodejs', 'web-development'],
        status: 'published'
      },
      {
        title: 'Работа с MongoDB и Mongoose',
        content: 'MongoDB - это документо-ориентированная NoSQL база данных, которая хранит данные в виде JSON-подобных документов. Mongoose - это библиотека для Node.js, которая упрощает работу с MongoDB, предоставляя схему-базированное решение для моделирования данных приложения.',
        author: users[1]._id,
        tags: ['mongodb', 'mongoose', 'database'],
        status: 'published'
      },
      {
        title: 'Аутентификация с Passport.js',
        content: 'Passport.js - это middleware для Node.js, который предоставляет комплексное решение для аутентификации. Он поддерживает более 500 стратегий аутентификации, включая локальную аутентификацию, OAuth, OpenID и другие. Passport упрощает интеграцию различных методов аутентификации в ваше приложение.',
        author: users[2]._id,
        tags: ['passport', 'authentication', 'security'],
        status: 'published'
      },
      {
        title: 'Middleware в Express.js',
        content: 'Middleware в Express.js - это функции, которые имеют доступ к объекту запроса (req), объекту ответа (res) и следующей функции middleware в цикле запрос-ответ. Middleware может выполнять код, изменять объекты запроса и ответа, завершать цикл запрос-ответ или вызывать следующий middleware в стеке.',
        author: users[0]._id,
        tags: ['express', 'middleware', 'nodejs'],
        status: 'published'
      },
      {
        title: 'Валидация данных с Joi',
        content: 'Joi - это библиотека для валидации данных в JavaScript. Она позволяет определять схемы для ваших данных и автоматически валидировать их. Joi особенно полезен в веб-приложениях для валидации входящих данных от пользователей, API запросов и конфигурационных файлов.',
        author: users[1]._id,
        tags: ['joi', 'validation', 'data'],
        status: 'published'
      }
    ])
    
    console.log('✅ База данных успешно инициализирована!')
    console.log(`📊 Создано пользователей: ${users.length}`)
    console.log(`📝 Создано статей: ${articles.length}`)
    
    console.log('\n👤 Тестовые пользователи:')
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`)
    })
    
    console.log('\n📄 Тестовые статьи:')
    articles.forEach(article => {
      console.log(`  - ${article.title} (автор: ${users.find(u => u._id.equals(article.author))?.name})`)
    })
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Ошибка при инициализации базы данных:', error)
    process.exit(1)
  }
}

initializeDatabase() 