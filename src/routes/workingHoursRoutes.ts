import express from "express";
import {
  createWorkingHours,
  getWorkingHours,
  updateWorkingHours,
  deleteWorkingHours,
} from "@/controllers/workingHoursController";
import { validate } from "@/middlewares/validate";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import {
  createWorkingHoursSchema,
  updateWorkingHoursSchema,
} from "@/validators/workingHoursValidator";

const router = express.Router();

// **Créer des horaires de travail**
router.post(
  "/",
  isAuthenticated, // Vérifie que l'utilisateur est authentifié
  validate(createWorkingHoursSchema, "body"), // Valide les données d'entrée
  createWorkingHours
);

// **Récupérer les horaires de travail**
router.get(
  "/",
  getWorkingHours
);

// **Mettre à jour des horaires de travail**
router.put(
  "/:id",
  isAuthenticated, // Vérifie que l'utilisateur est authentifié
  verifyAccess(["admin", "employé"]), // Autorise les employés ou admins à modifier
  validate(updateWorkingHoursSchema, "body"), // Valide les données de mise à jour
  updateWorkingHours
);

// **Supprimer des horaires de travail**
router.delete(
  "/:id",
  isAuthenticated, // Vérifie que l'utilisateur est authentifié
  verifyAccess(["admin", "employé"]), // Autorise les employés ou admins à supprimer
  deleteWorkingHours
);

export default router;
