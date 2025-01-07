import Joi from "joi";

// **Validator pour créer un service**
export const createServiceSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .optional()
        .messages({
            "string.base": "Le nom doit être une chaîne de caractères.",
            "string.max": "Le nom ne peut pas dépasser 50 caractères.",
        }),
    description: Joi.string()
        .max(500)
        .optional()
        .messages({
            "string.base": "description doit être une chaîne de caractères.",
            "string.max": "description ne peut pas dépasser 500 caractères.",
        }),
    
    duration: Joi.string()
        .min(1)
        .required()
        .messages({
            "string.base": "duration doit être une chaîne de caractères.",
            "string.min": "duration doit contenir au moins 1 caractère.",
            "any.required": "Le champ duration est obligatoire.",
        })
        .custom((value: string, helpers: any) => {
            // match XX:XX format
            if (!value.match(/^\d{1,2}:\d{2}$/)) {
                return helpers.error("format de duration invalide");
            }
            return value;
        })
        .messages({
            "format de duration invalide": "Le format de duration est invalide. Utilisez le format HH:MM."
        }),
    category: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "category doit être une chaîne de caractères.",
            "string.min": "category doit contenir au moins 3 caractères.",
            "string.max": "category ne peut pas dépasser 50 caractères.",
            "any.required": "Le champ category est obligatoire.",
        }),
    price: Joi.number()
        .precision(2)
        .min(0)
        .required()
        .messages({
            "number.base": "price doit être un nombre.",
            "number.min": "price doit être supérieur ou égal à 0.",
            "any.required": "Le champ price est obligatoire.",
        }),
});

// **Validator pour mettre à jour un service**
export const updateServiceSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .messages({
            "string.base": "name doit être une chaîne de caractères.",
            "string.min": "name doit contenir au moins 3 caractères.",
            "string.max": "name ne peut pas dépasser 50 caractères.",
        }),
    description: Joi.string()
        .max(500)
        .messages({
            "string.base": "description doit être une chaîne de caractères.",
            "string.max": "description ne peut pas dépasser 500 caractères.",
        }),
    duration: Joi.number()
        .integer()
        .min(1)
        .messages({
            "number.base": "duration doit être un nombre entier.",
            "number.min": "duration doit être au moins 1 minute.",
        }),
    price: Joi.number()
        .precision(2)
        .min(0)
        .messages({
            "number.base": "price doit être un nombre.",
            "number.min": "price doit être supérieur ou égal à 0.",
        }),
    isActive: Joi.boolean().messages({
        "boolean.base": "isActive doit être un booléen.",
    }),
}).min(1); // Au moins un champ doit être fourni

// **Validator pour filtrer les services**
export const filterServiceSchema = Joi.object({
    name: Joi.string()
        .max(50)
        .messages({
            "string.base": "name doit être une chaîne de caractères.",
            "string.max": "name ne peut pas dépasser 50 caractères.",
        })
        .optional(),
    isActive: Joi.boolean().messages({
        "boolean.base": "isActive doit être un booléen.",
    })
    .optional(),
}).or("name", "isActive"); // Au moins un critère doit être fourni
