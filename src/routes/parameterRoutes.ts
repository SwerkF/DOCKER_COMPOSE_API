import express from "express";
import { getParameters, updateParameters } from "@/controllers/parameterController";
import { validate } from "@/middlewares/validate";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import { updateParameterSchema } from "@/validators/parameterValidator";

const router = express.Router();

// **Récupérer les paramètres de l'entreprise**
router.get(
  "/",
  isAuthenticated, // Vérifie que l'utilisateur est connecté
  verifyAccess(["admin"]), // Seuls les administrateurs peuvent accéder aux paramètres
  getParameters
);

// **Mettre à jour les paramètres de l'entreprise**
router.put(
  "/",
  isAuthenticated, // Vérifie que l'utilisateur est connecté
  verifyAccess(["admin"]), // Seuls les administrateurs peuvent mettre à jour les paramètres
  validate(updateParameterSchema, "body"), // Valide les données de mise à jour
  updateParameters
);

export default router;
