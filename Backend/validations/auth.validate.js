import Joi from "joi";

const loginValidate = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long",
    "any.required": "Username is required",
  }),
  password: Joi.string().min(4).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const registerValidate = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must be at most 30 characters long",
    "any.required": "Username is required",
  }),

  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),

  fullName: Joi.string().min(3).max(100).required().messages({
    "string.base": "Full name must be a string",
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters long",
    "string.max": "Full name must be at most 100 characters long",
    "any.required": "Full name is required",
  }),
});

export { registerValidate, loginValidate };
