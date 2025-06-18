import { celebrate, Joi } from 'celebrate'

export const validateRegistration = celebrate({
  body: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Некорректный формат email',
        'any.required': 'Email обязателен'
      }),
    password: Joi.string().min(5).required()
      .messages({
        'string.min': 'Пароль должен содержать минимум 5 символов',
        'any.required': 'Пароль обязателен'
      })
  })
})

export const validateLogin = celebrate({
  body: Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Некорректный формат email',
        'any.required': 'Email обязателен'
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Пароль обязателен'
      })
  })
}) 