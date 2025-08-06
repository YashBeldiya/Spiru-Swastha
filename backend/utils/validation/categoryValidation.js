const Joi = require('joi');

const categoryValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'Category name must be a string!',
      'string.empty': 'Category name is required!',
      'string.min': 'Category name must be at least 2 characters long!',
      'string.max': 'Category name must not exceed 50 characters!',
      'any.required': 'Category name is required!'
    }),

  categoryImage: Joi.string()
    .uri()
    .required()
    .messages({
      'string.base': 'Category image must be a string!',
      'string.empty': 'Category image is required!',
      'string.uri': 'Category image must be a valid URL!',
      'any.required': 'Category image is required!'
    }),

  icon: Joi.string()
    .uri()
    .required()
    .messages({
      'string.base': 'Icon must be a string!',
      'string.empty': 'Icon is required!',
      'string.uri': 'Icon must be a valid URL!',
      'any.required': 'Icon is required!'
    }),

  slug: Joi.string()
    .alphanum()
    .required()
    .messages({
      'string.base': 'Slug must be a string!',
      'string.empty': 'Slug is required!',
      'string.alphanum': 'Slug must only contain letters and numbers!',
      'any.required': 'Slug is required!'
    }),

  isActive: Joi.boolean()
    .messages({
      'boolean.base': 'isActive must be a boolean (true or false)!'
    })
});

module.exports = { categoryValidation };
