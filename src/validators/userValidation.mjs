import { celebrate, Joi } from 'celebrate'

export const validateUser = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  })
})

export const validateUserUpdate = celebrate({
  params: Joi.object({
    userId: Joi.string().required()
  }),
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(5)
  }).min(1)
})

export const validateUserDelete = celebrate({
  params: Joi.object({
    userId: Joi.string().required()
  })
})