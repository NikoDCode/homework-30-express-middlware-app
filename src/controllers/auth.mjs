import { generateToken } from '../middleware/auth.mjs'

// Здесь в реальном приложении должна быть база данных
const users = []

export const register = (req, res) => {
  const { email, password } = req.body

  // Проверка существования пользователя
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ message: 'Пользователь уже существует' })
  }

  // Создание нового пользователя
  const newUser = {
    id: users.length + 1,
    email,
    password // В реальном приложении пароль должен быть хэширован
  }

  users.push(newUser)

  // Генерация токена
  const token = generateToken(newUser)

  // Установка cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  })

  res.status(201).json({ message: 'Регистрация успешна' })
}

export const login = (req, res) => {
  const { email, password } = req.body

  // Поиск пользователя
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    return res.status(401).json({ message: 'Неверный email или пароль' })
  }

  // Генерация токена
  const token = generateToken(user)

  // Установка cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  })

  res.json({ message: 'Вход выполнен успешно' })
}

export const logout = (req, res) => {
  res.clearCookie('token')
  res.json({ message: 'Выход выполнен успешно' })
} 