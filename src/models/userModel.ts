import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ('admin' | 'employé' | 'client')[]; // Tableau des rôles
  services: mongoose.Schema.Types.ObjectId[]; // Liste des services que l'utilisateur peut effectuer
  permissions?: string[];
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    role: {
      type: [String], // Tableau de chaînes
      enum: ['admin', 'employé', 'client'], // Valeurs autorisées
      default: ['client'], // Valeur par défaut
    },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }], // Relation vers les services
    permissions: [{ type: String, trim: true }], // Permissions spécifiques
    refreshToken: { type: String, trim: true }, // Stockage du token de rafraîchissement
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
