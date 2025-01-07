import express from "express";
import {
  createService,
  getServices,
  updateService,
  deleteService,
  toggleServiceState,
} from "@/controllers/serviceController";
import { validate } from "@/middlewares/validate";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import {
  createServiceSchema,
  updateServiceSchema,
  filterServiceSchema,
} from "@/validators/serviceValidator";
import Joi from "joi";

const router = express.Router();

// **Créer un nouveau service**
router.post(
  "/",
  isAuthenticated, // Vérifie que l'utilisateur est authentifié
  verifyAccess(["admin"]), // Seuls les admins peuvent créer un service
  validate(createServiceSchema, "body"), // Valide les données du service
  createService
);

// **Récupérer les services avec des filtres**
router.get(
  "/",
  //isAuthenticated, // Vérifie que l'utilisateur est authentifié
  //validate(filterServiceSchema, "query"), // Valide les paramètres de la requête
  getServices
);

// **Mettre à jour un service**
router.put(
  "/:id",
  isAuthenticated, // Vérifie que l'utilisateur est authentifié
  verifyAccess(["admin"]), // Seuls les admins peuvent mettre à jour un service
  validate(updateServiceSchema, "body"), // Valide les champs de mise à jour
  updateService
);

// **Supprimer un service**
router.delete(
  "/:id",
  isAuthenticated, // Vérifie que l'utilisateur est authentifié
  verifyAccess(["admin"]), // Seuls les admins peuvent supprimer un service
  deleteService
);

// **Activer/Désactiver un service**
router.patch(
  "/:id/toggle",
  isAuthenticated, // Vérifie que l'utilisateur est authentifié
  verifyAccess(["admin"]), // Seuls les admins peuvent activer/désactiver un service
  validate(
    Joi.object({
      isActive: Joi.boolean().required().messages({
        "any.required": "Le champ isActive est obligatoire.",
        "boolean.base": "isActive doit être un booléen.",
      }),
    }),
    "body"
  ), // Valide le statut `isActive`
  toggleServiceState
);

export default router;
