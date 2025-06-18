import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'

// В реальном приложении здесь будет работа с базой данных
export const users = []

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = users.find(u => u.email === email)
      
      if (!user) {
        return done(null, false, { message: 'Пользователь не найден' })
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Неверный пароль' })
      }

      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id)
  done(null, user)
})

export default passport 