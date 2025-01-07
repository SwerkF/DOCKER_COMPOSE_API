import Joi from "joi";

/**
 * Validator for creating working hours.
 * Ensures all required fields are present and valid.
 */
export const createWorkingHoursSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // MongoDB ObjectId validation
    .required()
    .messages({
      "string.pattern.base": "userId must be a valid MongoDB ObjectId.",
      "any.required": "userId is required.",
    }),
  startTime: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm format
    .required()
    .messages({
      "string.pattern.base": "startTime must be in HH:mm format.",
      "any.required": "startTime is required.",
    }),
  endTime: Joi.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:mm format
    .required()
    .messages({
      "string.pattern.base": "endTime must be in HH:mm format.",
      "any.required": "endTime is required.",
    }),
  isRecurring: Joi.boolean()
    .required()
    .messages({
      "boolean.base": "isRecurring must be a boolean.",
      "any.required": "isRecurring is required.",
    }),
  day: Joi.string()
    .when("isRecurring", {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().optional(),
    })
    .messages({
      "any.required": "day is required when isRecurring is true.",
    }),
  date: Joi.date()
    .iso()
    .when("isRecurring", {
      is: false,
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "date.base": "date must be a valid ISO date.",
      "any.required": "date is required when isRecurring is false.",
    }),
});

/**
 * Validator for updating working hours.
 * Ensures at least one field is provided for updating.
 */
export const updateWorkingHoursSchema = Joi.object({
  startTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
    "string.pattern.base": "startTime must be in HH:mm format.",
  }),
  endTime: Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({
    "string.pattern.base": "endTime must be in HH:mm format.",
  }),
  isRecurring: Joi.boolean().messages({
    "boolean.base": "isRecurring must be a boolean.",
  }),
  recurrencePattern: Joi.string()
    .valid("daily", "weekly", "monthly", "none")
    .messages({
      "any.only": "recurrencePattern must be one of [daily, weekly, monthly, none].",
    }),
  date: Joi.date().iso().messages({
    "date.base": "date must be a valid ISO date.",
  }),
}).min(1); // At least one field must be present
