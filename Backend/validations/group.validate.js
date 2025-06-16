import Joi from "joi";

const groupValidate = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must be at most 50 characters long',
      'any.required': 'Name is required'
    }),

  description: Joi.string()
    .allow('')
    .max(500)
    .messages({
      'string.base': 'Description must be a string',
      'string.max': 'Description must be at most 500 characters long'
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

export {groupValidate}