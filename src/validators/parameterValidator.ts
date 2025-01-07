import Joi from "joi";

// Validator pour créer ou mettre à jour les paramètres
export const updateParameterSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "name doit être une chaîne de caractères.",
      "string.min": "name doit contenir au moins 3 caractères.",
      "string.max": "name ne peut pas dépasser 100 caractères.",
      "any.required": "Le champ name est obligatoire.",
    }),
  description: Joi.string()
    .max(500)
    .optional()
    .messages({
      "string.base": "description doit être une chaîne de caractères.",
      "string.max": "description ne peut pas dépasser 500 caractères.",
    }),
  logoUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "logoUrl doit être une URL valide.",
    }),
  address: Joi.string()
    .max(255)
    .optional()
    .messages({
      "string.base": "address doit être une chaîne de caractères.",
      "string.max": "address ne peut pas dépasser 255 caractères.",
    }),
  phone: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/)
    .optional()
    .messages({
      "string.pattern.base": "phone doit être un numéro de téléphone valide.",
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "email doit être une adresse email valide.",
    }),
  websiteUrl: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "websiteUrl doit être une URL valide.",
    }),
  socialMediaUrls: Joi.object({
    facebook: Joi.string().uri().optional().messages({
      "string.uri": "facebook doit être une URL valide.",
    }),
    twitter: Joi.string().uri().optional().messages({
      "string.uri": "twitter doit être une URL valide.",
    }),
    linkedin: Joi.string().uri().optional().messages({
      "string.uri": "linkedin doit être une URL valide.",
    }),
    instagram: Joi.string().uri().optional().messages({
      "string.uri": "instagram doit être une URL valide.",
    }),
  }).optional(),
  enableEmailNotifications: Joi.boolean().optional().messages({
    "boolean.base": "enableEmailNotifications doit être un booléen.",
  }),
  enableSmsNotifications: Joi.boolean().optional().messages({
    "boolean.base": "enableSmsNotifications doit être un booléen.",
  }),
  defaultBookingReminderTime: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      "number.base": "defaultBookingReminderTime doit être un nombre entier.",
      "number.min": "defaultBookingReminderTime doit être supérieur ou égal à 0.",
    }),
});
