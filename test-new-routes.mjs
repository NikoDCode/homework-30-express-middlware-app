#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки новых маршрутов с курсорами и агрегационными запросами
 * Запуск: node test-new-routes.mjs
 */

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000'

// Функция для выполнения HTTP запросов
async function makeRequest(method, endpoint, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()
    
    return {
      status: response.status,
      data
    }
  } catch (error) {
    return {
      status: 'ERROR',
      data: { error: error.message }
    }
  }
}

// Тестирование курсоров
async function testCursors() {
  console.log('\n🔍 Тестирование курсоров...')
  
  // 1. Получение статей через курсор
  console.log('\n1. Получение статей через курсор:')
  const cursorResult = await makeRequest('GET', '/articles/cursor?limit=5')
  console.log(`Статус: ${cursorResult.status}`)
  console.log(`Количество статей: ${cursorResult.data.count || 0}`)
  
  // 2. Пакетная обработка статей
  console.log('\n2. Пакетная обработка статей:')
  const processResult = await makeRequest('POST', '/articles/cursor/process', {
    batchSize: 5,
    operation: 'analyze'
  })
  console.log(`Статус: ${processResult.status}`)
  console.log(`Обработано статей: ${processResult.data.totalProcessed || 0}`)
  
  // 3. Получение статей по тегу через курсор
  console.log('\n3. Получение статей по тегу через курсор:')
  const tagResult = await makeRequest('GET', '/articles/cursor/tags/javascript?limit=3')
  console.log(`Статус: ${tagResult.status}`)
  console.log(`Количество статей с тегом "javascript": ${tagResult.data.count || 0}`)
}

// Тестирование агрегационных запросов
async function testAggregations() {
  console.log('\n📊 Тестирование агрегационных запросов...')
  
  // 1. Расширенная статистика
  console.log('\n1. Расширенная статистика:')
  const advancedStats = await makeRequest('GET', '/articles/stats/advanced')
  console.log(`Статус: ${advancedStats.status}`)
  if (advancedStats.data.stats?.summary) {
    console.log(`Общее количество статей: ${advancedStats.data.stats.summary.totalArticles}`)
    console.log(`Количество уникальных тегов: ${advancedStats.data.stats.summary.totalTags}`)
  }
  
  // 2. Статистика активности авторов
  console.log('\n2. Статистика активности авторов:')
  const authorStats = await makeRequest('GET', '/articles/stats/authors')
  console.log(`Статус: ${authorStats.status}`)
  console.log(`Количество авторов: ${authorStats.data.authors?.length || 0}`)
  
  // 3. Статистика популярности тегов
  console.log('\n3. Статистика популярности тегов:')
  const tagStats = await makeRequest('GET', '/articles/stats/tags')
  console.log(`Статус: ${tagStats.status}`)
  console.log(`Количество тегов: ${tagStats.data.tags?.length || 0}`)
  
  // 4. Кастомный агрегационный запрос
  console.log('\n4. Кастомный агрегационный запрос:')
  const customResult = await makeRequest('POST', '/articles/stats/custom', {
    pipeline: [
      { "$match": { "status": "published" } },
      { "$group": { "_id": "$status", "count": { "$sum": 1 } } }
    ]
  })
  console.log(`Статус: ${customResult.status}`)
  console.log(`Результат: ${JSON.stringify(customResult.data.result || [], null, 2)}`)
}

// Сравнение производительности
async function testPerformance() {
  console.log('\n⚡ Тестирование производительности...')
  
  // Обычный запрос
  console.log('\n1. Обычный запрос (все статьи):')
  const start1 = Date.now()
  const normalResult = await makeRequest('GET', '/articles')
  const time1 = Date.now() - start1
  console.log(`Время выполнения: ${time1}ms`)
  console.log(`Статус: ${normalResult.status}`)
  
  // Запрос через курсор
  console.log('\n2. Запрос через курсор:')
  const start2 = Date.now()
  const cursorResult = await makeRequest('GET', '/articles/cursor?limit=50')
  const time2 = Date.now() - start2
  console.log(`Время выполнения: ${time2}ms`)
  console.log(`Статус: ${cursorResult.status}`)
  
  // Сравнение
  console.log('\n📈 Сравнение производительности:')
  console.log(`Обычный запрос: ${time1}ms`)
  console.log(`Курсор: ${time2}ms`)
  console.log(`Разница: ${time1 - time2}ms`)
  
  if (time2 < time1) {
    console.log('✅ Курсор работает быстрее!')
  } else {
    console.log('⚠️ Курсор не показал улучшения (возможно, мало данных)')
  }
}

// Основная функция тестирования
async function runTests() {
  console.log('🚀 Запуск тестов новых маршрутов...')
  console.log(`Базовый URL: ${BASE_URL}`)
  
  try {
    await testCursors()
    await testAggregations()
    await testPerformance()
    
    console.log('\n✅ Все тесты завершены!')
    console.log('\n📝 Для более детального тестирования используйте команды из README.md')
    
  } catch (error) {
    console.error('\n❌ Ошибка при выполнении тестов:', error.message)
    console.log('\n💡 Убедитесь, что сервер запущен на http://localhost:3000')
  }
}

// Запуск тестов
runTests() 