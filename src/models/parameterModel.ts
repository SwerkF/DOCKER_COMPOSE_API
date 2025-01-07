import mongoose, { Schema, Document } from 'mongoose';

// Interface TypeScript pour le modèle Parameter
export interface IParameter extends Document {
  name: string;
  description: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  socialMediaUrls?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  defaultBookingReminderTime: number; // Temps avant rappel (en minutes)
  minBookingDelay: number; // Temps minimal avant une réservation (en heures)
  maxBookingDelay: number; // Temps maximal avant une réservation (en jours)
  createdAt: Date;
  updatedAt: Date;
}

const parameterSchema: Schema<IParameter> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    logoUrl: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    websiteUrl: { type: String, trim: true },
    socialMediaUrls: {
      facebook: { type: String, trim: true },
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
    },
    enableEmailNotifications: { type: Boolean, default: true },
    enableSmsNotifications: { type: Boolean, default: false },
    defaultBookingReminderTime: { type: Number, default: 15 }, // Ex. 15 minutes
    minBookingDelay: { type: Number, default: 1 }, // Ex. 1 heure
    maxBookingDelay: { type: Number, default: 30 }, // Ex. 30 jours
  },
  { timestamps: true }
);

export const Parameter = mongoose.model<IParameter>('Parameter', parameterSchema);
