import express from "express";
import {
  createBooking,
  getBookings,
  getUpcomingBookings,
  updateBooking,
  deleteBooking,
} from "@/controllers/bookingController";
import { validate } from "@/middlewares/validate";
import { isAuthenticated, hasToken } from "@/middlewares/auth";
import { verifyAccess } from "@/middlewares/verifyAccess";
import {
  createBookingSchema,
  updateBookingSchema,
  filterBookingSchema,
} from "@/validators/bookingValidator";

const router = express.Router();

// **Créer une réservation**
router.post(
  "/",
  hasToken,
  //isAuthenticated, // Middleware pour vérifier si l'utilisateur est authentifié
  validate(createBookingSchema, "body"), // Validation des données
  createBooking
);

// **Récupérer toutes les réservations**
router.get(
  "/",
  //isAuthenticated, // Authentification obligatoire
  //validate(filterBookingSchema, "query"), // Validation des paramètres de requête
  getBookings
);

// **Récupérer les réservations à venir**
router.get(
  "/upcoming",
  isAuthenticated, // Authentification obligatoire
  validate(filterBookingSchema, "query"), // Validation optionnelle pour filtrer par userId
  getUpcomingBookings
);

// **Mettre à jour une réservation**
router.put(
  "/:id",
  isAuthenticated, // Authentification obligatoire
  verifyAccess(["admin", "employé"]), // Vérification des permissions (seulement admin/employé)
  validate(updateBookingSchema, "body"), // Validation des données de mise à jour
  updateBooking
);

// **Supprimer une réservation**
router.delete(
  "/:id",
  isAuthenticated, // Authentification obligatoire
  verifyAccess(["admin"]), // Seuls les administrateurs peuvent supprimer une réservation
  deleteBooking
);

export default router;
