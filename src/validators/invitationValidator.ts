import Joi from "joi";

/**
 * Validator for creating an invitation.
 * Ensures the required fields for an invitation are present and valid.
 */
export const createInvitationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "email must be a valid email address.",
      "any.required": "email is required.",
    }),
  role: Joi.string()
    .valid("admin", "employé", "client")
    .required()
    .messages({
      "any.only": "role must be one of [admin, employé, client].",
      "any.required": "role is required.",
    }),
});

/**
 * Validator for updating an invitation.
 * Allows updating the status of an invitation.
 */
export const updateInvitationSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "declined", "revoked")
    .required()
    .messages({
      "any.only": "status must be one of [pending, accepted, declined, revoked].",
      "any.required": "status is required.",
    }),
});

/**
 * Validator for filtering invitations.
 * Allows filtering by email or status.
 */
export const filterInvitationSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "email must be a valid email address.",
  }),
  status: Joi.string()
    .valid("pending", "accepted", "declined", "revoked")
    .messages({
      "any.only": "status must be one of [pending, accepted, declined, revoked].",
    }),
}).or("email", "status"); // At least one filter must be provided
