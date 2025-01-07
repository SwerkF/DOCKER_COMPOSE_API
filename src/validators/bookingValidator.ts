import Joi from "joi";

// **Validator pour créer une réservation**
export const createBookingSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "userId doit être un ObjectId MongoDB valide.",
      "any.required": "Le champ userId est obligatoire.",
    }),
  serviceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "serviceId doit être un ObjectId MongoDB valide.",
      "any.required": "Le champ serviceId est obligatoire.",
    }),
  date: Joi.date()
    .required()
    .messages({
      "date.base": "date doit être une date valide.",
      "any.required": "Le champ date est obligatoire.",
    }),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.pattern.base": "time doit être au format HH:mm.",
      "any.required": "Le champ time est obligatoire.",
    }),
  firstName: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "firstName doit être une chaîne de caractères.",
      "string.max": "firstName ne peut pas dépasser 50 caractères.",
    }),
  lastName: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "lastName doit être une chaîne de caractères.",
      "string.max": "lastName ne peut pas dépasser 50 caractères.",
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "email doit être un email valide.",
    }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base": "phoneNumber doit être un numéro de téléphone valide.",
    }),
  postalCode: Joi.string()
    .pattern(/^\d{5}$/)
    .optional()
    .messages({
      "string.pattern.base": "postalCode doit être un code postal valide.",
    }),
  message: Joi.string()
    .min(0)
    .max(255)
    .optional()
    .messages({
      "string.base": "message doit être une chaîne de caractères.",
      "string.min": "message ne peut pas être vide.",
      "string.max": "message ne peut pas dépasser 255 caractères.",
    }),
});

// **Validator pour mettre à jour une réservation**
export const updateBookingSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "userId doit être un ObjectId MongoDB valide.",
    }),
  serviceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "serviceId doit être un ObjectId MongoDB valide.",
    }),
  date: Joi.date()
    .iso()
    .messages({
      "date.base": "date doit être une date valide.",
    }),
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .messages({
      "any.only": "status doit être l'un des suivants : [pending, confirmed, cancelled, completed].",
    }),
  message: Joi.string()
    .max(255)
    .messages({
      "string.base": "message doit être une chaîne de caractères.",
      "string.max": "message ne peut pas dépasser 255 caractères.",
    }),
}).min(1); // Au moins un champ doit être fourni

// **Validator pour filtrer les réservations**
export const filterBookingSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "userId doit être un ObjectId MongoDB valide.",
    }),
  serviceId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.pattern.base": "serviceId doit être un ObjectId MongoDB valide.",
    }),
  dateFrom: Joi.date()
    .iso()
    .messages({
      "date.base": "dateFrom doit être une date valide.",
    }),
  dateTo: Joi.date()
    .iso()
    .messages({
      "date.base": "dateTo doit être une date valide.",
    }),
  status: Joi.string()
    .valid("pending", "confirmed", "cancelled", "completed")
    .messages({
      "any.only": "status doit être l'un des suivants : [pending, confirmed, cancelled, completed].",
    }),
}).or("userId", "serviceId", "dateFrom", "dateTo", "status"); // Au moins un critère doit être fourni
