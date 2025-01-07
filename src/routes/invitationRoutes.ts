import express from "express";
import {
  createInvitation,
  getInvitation,
  updateInvitation,
  deleteInvitation,
} from "@/controllers/invitationController";
import { validate } from "@/middlewares/validate";
import { isAuthenticated } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import {
  createInvitationSchema,
  updateInvitationSchema,
  filterInvitationSchema,
} from "@/validators/invitationValidator";

const router = express.Router();

// **Créer une invitation**
router.post(
  "/",
  isAuthenticated, // Vérifie que l'utilisateur est connecté
  verifyAccess(["admin"]), // Seuls les administrateurs peuvent envoyer des invitations
  validate(createInvitationSchema, "body"), // Valide les données de création
  createInvitation
);

// **Récupérer une invitation par ID**
router.get(
  "/:id",
  isAuthenticated, // Vérifie que l'utilisateur est connecté
  verifyAccess(["admin"]), // Seuls les administrateurs peuvent consulter une invitation
  getInvitation
);

// **Mettre à jour une invitation (statut)**
router.put(
  "/:id",
  isAuthenticated, // Vérifie que l'utilisateur est connecté
  verifyAccess(["admin"]), // Seuls les administrateurs peuvent modifier une invitation
  validate(updateInvitationSchema, "body"), // Valide les données de mise à jour
  updateInvitation
);

// **Supprimer une invitation par ID**
router.delete(
  "/:id",
  isAuthenticated, // Vérifie que l'utilisateur est connecté
  verifyAccess(["admin"]), // Seuls les administrateurs peuvent supprimer une invitation
  deleteInvitation
);

export default router;
