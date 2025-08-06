const Joi = require('joi');

const registrationValidation =  Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required().messages({
            "string.base" : "Name must be a String !",
            "string.empty" : "Name can't be empty !",
            "any.required" : "Name is required !",
            "string.min" : "Name length must be at least 3 characters long"
        }),

    age : Joi.number().min(18).max(65).required().messages({
        "number.base" : "Age must be a Number !",
        "any.required" : "Age is required !",
        "number.min" : "Age must be greater than or equal to 18",
        "number.max" : "Age must be less than or equal to 65"
    }),

    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required().messages({
        "string.base" : "Email must be a String !",
        "string.empty" : "Email can't be empty !",
        "any.required" : "Email is required !",
        "string.email": "Email must be a valid email address with .com domain!"
    }),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
            "string.base" : "Password must be a String !",
            "string.empty" : "Password can't be empty !",
            "any.required" : "Password is required !"
        }),

    phone : Joi.string().required().messages({
        "string.base" : "Phone must be a String !",
        "string.empty" : "Phone can't be empty !",
        "any.required" : "Phone is required !"
    }),

  
})

const loginValidation = Joi.object({
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com'] } }).required().messages({
        "string.base" : "Email must be a String !",
        "string.empty" : "Email can't be empty !",
        "any.required" : "Email is required !",
        "string.email": "Email must be a valid email address with .com domain!"
    }),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
            "string.base" : "Password must be a String !",
            "string.empty" : "Password can't be empty !",
            "any.required" : "Password is required !"
        }),
})

const verifyOtpValidation = Joi.object({
    otp: Joi.number().required().messages({
        "number.base" : "Age must be a Number !",
        "any.required" : "Age is required !",
    }),
    type : Joi.string().required().messages({
        "string.base" : "type must be a String !",
        "string.empty" : "type can't be empty !",
        "any.required" : "type is required !"
    }),
    userId : Joi.string().required().messages({
        "string.base" : "userId must be a String !",
        "string.empty" : "userId can't be empty !",
        "any.required" : "userId is required !"
    })
})

const changePasswordValidation = Joi.object({
    oldPassword : Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
        "string.base" : "Password must be a String !",
        "string.empty" : "Password can't be empty !",
        "any.required" : "Password is required !"
    }),

    newPassword : Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
        "string.base" : "Password must be a String !",
        "string.empty" : "Password can't be empty !",
        "any.required" : "Password is required !"
    })
})



module.exports = {registrationValidation,loginValidation,verifyOtpValidation,changePasswordValidation}