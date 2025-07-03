import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import { UserService } from '../services/userService.mjs'

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await UserService.getUserByEmail(email)
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

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.getUserById(id)
    done(null, user)
  } catch (error) {
    done(error)
  }
})

export default passport 