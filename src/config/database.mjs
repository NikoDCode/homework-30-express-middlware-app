import mongoose from 'mongoose'
import { CONFIG } from './config.mjs'

const MONGODB_URI = CONFIG.URI

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB Atlas подключена успешно')
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB Atlas:', error.message)
    process.exit(1)
  }
}

export default mongoose 