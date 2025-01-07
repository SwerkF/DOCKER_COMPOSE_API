import mongoose, { Schema, Document } from "mongoose";

// Interface TypeScript pour le modèle Absence
export interface IAbsence extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Référence à l'utilisateur
  startDate: Date; // Date de début de l'absence
  endDate: Date; // Date de fin de l'absence
  reason: string; // Motif de l'absence (ex : congé, maladie)
  createdAt: Date; // Ajouté automatiquement par Mongoose
  updatedAt: Date; // Ajouté automatiquement par Mongoose
}

// Schéma Mongoose pour les absences
const absenceSchema: Schema<IAbsence> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence vers le modèle User
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true } // Ajoute automatiquement createdAt et updatedAt
);

// Export du modèle Mongoose
export const Absence = mongoose.model<IAbsence>("Absence", absenceSchema);
