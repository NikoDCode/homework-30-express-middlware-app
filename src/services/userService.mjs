import User from '../models/User.mjs'

export class UserService {
  // Получить всех пользователей
  static async getAllUsers() {
    try {
      const users = await User.find({}).select('-password').sort({ createdAt: -1 })
      return users
    } catch (error) {
      throw new Error(`Ошибка при получении пользователей: ${error.message}`)
    }
  }

  // Получить пользователя по ID
  static async getUserById(id) {
    try {
      const user = await User.findById(id).select('-password')
      if (!user) {
        throw new Error('Пользователь не найден')
      }
      return user
    } catch (error) {
      throw new Error(`Ошибка при получении пользователя: ${error.message}`)
    }
  }

  // Получить пользователя по email
  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() })
      return user
    } catch (error) {
      throw new Error(`Ошибка при поиске пользователя: ${error.message}`)
    }
  }

  // Создать нового пользователя
  static async createUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() })
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует')
      }

      const user = new User({
        email: userData.email,
        password: userData.password,
        name: userData.name || userData.email.split('@')[0],
        role: userData.role || 'user'
      })

      await user.save()
      return user.toPublicJSON()
    } catch (error) {
      throw new Error(`Ошибка при создании пользователя: ${error.message}`)
    }
  }

  // Обновить пользователя
  static async updateUser(id, updateData) {
    try {
      const user = await User.findById(id)
      if (!user) {
        throw new Error('Пользователь не найден')
      }

      // Удаляем пароль из данных обновления, если он не изменяется
      if (updateData.password) {
        user.password = updateData.password
      }
      
      if (updateData.name) user.name = updateData.name
      if (updateData.email) user.email = updateData.email
      if (updateData.role) user.role = updateData.role

      await user.save()
      return user.toPublicJSON()
    } catch (error) {
      throw new Error(`Ошибка при обновлении пользователя: ${error.message}`)
    }
  }

  // Удалить пользователя
  static async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id)
      if (!user) {
        throw new Error('Пользователь не найден')
      }
      return { message: 'Пользователь успешно удален' }
    } catch (error) {
      throw new Error(`Ошибка при удалении пользователя: ${error.message}`)
    }
  }
} 