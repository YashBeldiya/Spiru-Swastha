const Joi = require('joi');

const spiruProductValidation = Joi.object({
  productName: Joi.string().min(2).required().messages({
    'string.base': 'Product name must be a string!',
    'string.empty': 'Product name is required!',
    'string.min': 'Product name must be at least 2 characters!',
    'any.required': 'Product name is required!'
  }),

  category: objectId.required().messages({
    'any.invalid': 'Category ID must be a valid ObjectId!',
    'any.required': 'Category is required!'
  }),

  slug: Joi.string().lowercase().required().messages({
    'string.base': 'Slug must be a string!',
    'string.empty': 'Slug is required!',
    'any.required': 'Slug is required!'
  }),

  type: Joi.string().valid("Weight", "Quantity").required().messages({
    'any.only': 'Type must be either "Weight" or "Quantity"!',
    'any.required': 'Type is required!'
  }),

  benifits: Joi.array().items(
    Joi.object({
      icon: Joi.string().uri().required().messages({
        'string.base': 'Benefit icon must be a string!',
        'string.uri': 'Benefit icon must be a valid URL!',
        'any.required': 'Benefit icon is required!'
      }),
      description: Joi.string().required().messages({
        'string.base': 'Benefit description must be a string!',
        'string.empty': 'Benefit description is required!',
        'any.required': 'Benefit description is required!'
      })
    })
  ).messages({
    'array.base': 'Benefits must be an array of benefit objects!'
  }),

  SKU: Joi.string().trim().uppercase().required().messages({
    'string.base': 'SKU must be a string!',
    'string.empty': 'SKU is required!',
    'any.required': 'SKU is required!'
  }),

  variants: Joi.array().items(
    Joi.object({
      attribute: Joi.object({
        quantity: Joi.number().messages({
          'number.base': 'Attribute quantity must be a number!'
        }),
        label: Joi.string().messages({
          'string.base': 'Attribute label must be a string!'
        })
      }),

      label: Joi.string().messages({
        'string.base': 'Variant label must be a string!'
      }),

      SKU: Joi.string().trim().uppercase().required().messages({
        'string.base': 'Variant SKU must be a string!',
        'string.empty': 'Variant SKU is required!',
        'any.required': 'Variant SKU is required!'
      }),

      productImage: Joi.array().items(
        Joi.string().uri().required().messages({
          'string.uri': 'Each product image must be a valid URL!',
          'any.required': 'Product image URL is required!'
        })
      ).required().messages({
        'array.base': 'Product images must be an array!',
        'any.required': 'Product images are required!'
      }),

      originalPrice: Joi.number().required().messages({
        'number.base': 'Original price must be a number!',
        'any.required': 'Original price is required!'
      }),

      discountPrice: Joi.number().required().messages({
        'number.base': 'Discount price must be a number!',
        'any.required': 'Discount price is required!'
      }),

      discountPercent: Joi.number().messages({
        'number.base': 'Discount percent must be a number!'
      }),

      stockAvailability: Joi.number().messages({
        'number.base': 'Stock availability must be a number!'
      }),

      isActive: Joi.boolean().messages({
        'boolean.base': 'Variant isActive must be a boolean!'
      })
    })
  ).messages({
    'array.base': 'Variants must be an array of variant objects!'
  }),

  productVideo: Joi.array().items(
    Joi.string().uri().messages({
      'string.uri': 'Each product video URL must be valid!'
    })
  ).messages({
    'array.base': 'Product video must be an array!'
  }),

  isActive: Joi.boolean().messages({
    'boolean.base': 'isActive must be a boolean!'
  }),

  certifications: Joi.object({
    fssai: Joi.boolean().messages({
      'boolean.base': 'FSSAI must be a boolean!'
    }),
    iso: Joi.boolean().messages({
      'boolean.base': 'ISO must be a boolean!'
    }),
    gmp: Joi.boolean().messages({
      'boolean.base': 'GMP must be a boolean!'
    })
  }),

  productContent: objectId.messages({
    'any.invalid': 'Product content ID must be a valid ObjectId!'
  })
});

module.exports = { spiruProductValidation };
