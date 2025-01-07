import Joi from "joi";

/**
 * Validator for creating an absence.
 * Ensures all required fields are present and valid.
 */
export const createAbsenceSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "userId must be a valid MongoDB ObjectId.",
      "any.required": "userId is required.",
    }),
  startDate: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "startDate must be a valid ISO date.",
      "any.required": "startDate is required.",
    }),
  endDate: Joi.date()
    .iso()
    .min(Joi.ref("startDate"))
    .required()
    .messages({
      "date.base": "endDate must be a valid ISO date.",
      "date.min": "endDate must be greater than or equal to startDate.",
      "any.required": "endDate is required.",
    }),
  reason: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      "string.base": "reason must be a string.",
      "string.min": "reason must be at least 3 characters long.",
      "string.max": "reason must not exceed 255 characters.",
      "any.required": "reason is required.",
    }),
});

/**
 * Validator for updating an absence.
 * Ensures at least one field is provided for updating.
 */
export const updateAbsenceSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "userId must be a valid MongoDB ObjectId.",
    }),
  startDate: Joi.date()
    .iso()
    .messages({
      "date.base": "startDate must be a valid ISO date.",
    }),
  endDate: Joi.date()
    .iso()
    .min(Joi.ref("startDate"))
    .messages({
      "date.base": "endDate must be a valid ISO date.",
      "date.min": "endDate must be greater than or equal to startDate.",
    }),
  reason: Joi.string()
    .min(3)
    .max(255)
    .messages({
      "string.base": "reason must be a string.",
      "string.min": "reason must be at least 3 characters long.",
      "string.max": "reason must not exceed 255 characters.",
    }),
}).min(1); // At least one field must be present

/**
 * Validator for filtering absences.
 * Allows filtering by userId, startDate, and endDate.
 */
export const filterAbsenceSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "userId must be a valid MongoDB ObjectId.",
    }),
  startDate: Joi.date()
    .iso()
    .messages({
      "date.base": "startDate must be a valid ISO date.",
    }),
  endDate: Joi.date()
    .iso()
    .messages({
      "date.base": "endDate must be a valid ISO date.",
    }),
}).or("userId", "startDate", "endDate"); // At least one filter must be provided
