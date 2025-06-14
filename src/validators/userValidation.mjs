import { celebrate, Segments } from 'celebrate'
import Joi from 'joi'

const userSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  age: Joi.number().required().min(0).max(100)
})

const validateUserBody = celebrate({
  [Segments.BODY]: userSchema
})

const validateParamsUserId = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.number().integer().positive().required()
  })
})

export { validateUserBody, validateParamsUserId }