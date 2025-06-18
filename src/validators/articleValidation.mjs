import { celebrate, Joi } from 'celebrate'

export const validateArticle = celebrate({
  body: Joi.object({
    title: Joi.string().required().min(3).max(100),
    content: Joi.string().required().min(10),
    author: Joi.string().required()
  })
})

export const validateArticleUpdate = celebrate({
  params: Joi.object({
    articleId: Joi.string().required()
  }),
  body: Joi.object({
    title: Joi.string().min(3).max(100),
    content: Joi.string().min(10),
    author: Joi.string()
  }).min(1)
})

export const validateArticleDelete = celebrate({
  params: Joi.object({
    articleId: Joi.string().required()
  })
}) 