import express from 'express'

const router = express.Router()

// GET / - приветственное сообщение
router.get('/', (req, res) => {
  res.send('Добро пожаловать в Express Middleware App!')
})

export default router