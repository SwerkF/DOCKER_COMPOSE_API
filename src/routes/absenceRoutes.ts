const express = require("express");
const {
  createAbsence,
  getAbsences,
  updateAbsence,
  deleteAbsence,
} = require("@/controllers/absenceController");
import { validate } from '@/middlewares/validate';
import { isAuthenticated } from '@/middlewares/auth';
import { verifyAccess } from '@/middlewares/verifyAccess';
const {
  createAbsenceSchema,
  updateAbsenceSchema,
  filterAbsenceSchema,
} = require("../validators/absenceValidator");

const router = express.Router();

// Add an absence (admin or employee only)
router.post(
  "/",
  isAuthenticated,
  verifyAccess(["admin", "employé"]), // Only admins and employees can add absences
  validate(createAbsenceSchema, "body"),
  createAbsence
);

// Get absences (filter by userId, startDate, endDate)
router.get(
  "/",
  isAuthenticated,
  validate(filterAbsenceSchema, "query"),
  getAbsences
);

// Update an absence by ID
router.put(
  "/:id",
  isAuthenticated,
  verifyAccess(["admin", "employé"]), // Only admins and employees can update absences
  validate(updateAbsenceSchema, "body"),
  updateAbsence
);

// Delete an absence by ID (admin only)
router.delete(
  "/:id",
  isAuthenticated,
  verifyAccess(["admin"]), // Only admins can delete absences
  deleteAbsence
);

export default router;
