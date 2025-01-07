import Joi from "joi";

/**
 * Validator for user registration.
 * Validates data when creating a new user.
 */
export const registerUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "firstName must be a string.",
      "string.min": "firstName must have at least 2 characters.",
      "string.max": "firstName cannot exceed 50 characters.",
      "any.required": "firstName is required.",
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.base": "lastName must be a string.",
      "string.min": "lastName must have at least 2 characters.",
      "string.max": "lastName cannot exceed 50 characters.",
      "any.required": "lastName is required.",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "email must be a valid email address.",
      "any.required": "email is required.",
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.min": "password must have at least 8 characters.",
      "string.max": "password cannot exceed 128 characters.",
      "any.required": "password is required.",
    }),
  role: Joi.string()
    .valid("admin", "employé", "client")
    .optional()
    .messages({
      "any.only": "role must be one of [admin, employé, client].",
    }),
});

/**
 * Validator for user login.
 * Validates data for user authentication.
 */
export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "email must be a valid email address.",
      "any.required": "email is required.",
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .messages({
      "string.min": "password must have at least 8 characters.",
      "string.max": "password cannot exceed 128 characters.",
      "any.required": "password is required.",
    }),
});

/**
 * Validator for updating user details.
 * Validates data when updating user information.
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      "string.base": "firstName must be a string.",
      "string.min": "firstName must have at least 2 characters.",
      "string.max": "firstName cannot exceed 50 characters.",
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .messages({
      "string.base": "lastName must be a string.",
      "string.min": "lastName must have at least 2 characters.",
      "string.max": "lastName cannot exceed 50 characters.",
    }),
  email: Joi.string()
    .email()
    .messages({
      "string.email": "email must be a valid email address.",
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .messages({
      "string.min": "password must have at least 8 characters.",
      "string.max": "password cannot exceed 128 characters.",
    }),
  role: Joi.string()
    .valid("admin", "employé", "client")
    .messages({
      "any.only": "role must be one of [admin, employé, client].",
    }),
}).min(1); // At least one field must be provided

/**
 * Validator for filtering users.
 * Validates data when querying users.
 */
export const filterUserSchema = Joi.object({
  role: Joi.string()
    .valid("admin", "employé", "client")
    .messages({
      "any.only": "role must be one of [admin, employé, client].",
    }),
  email: Joi.string()
    .email()
    .messages({
      "string.email": "email must be a valid email address.",
    }),
}).or("role", "email"); // At least one filter must be provided

/**
 * Validator for updating user permissions.
 * Validates data when managing user permissions.
 */
export const updateUserPermissionsSchema = Joi.object({
  permissions: Joi.array()
    .items(Joi.string())
    .required()
    .messages({
      "array.base": "permissions must be an array of strings.",
      "any.required": "permissions is required.",
    }),
});
