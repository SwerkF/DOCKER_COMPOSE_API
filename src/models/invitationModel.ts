import mongoose, { Schema, Document } from 'mongoose';

export interface IInvitation extends Document {
  email: string;
  role: 'employé' | 'admin';
  services: mongoose.Schema.Types.ObjectId[]; // Services autorisés
  status: 'pending' | 'accepted' | 'declined';
  token: string; // Token unique pour l'invitation
  createdAt: Date;
  updatedAt: Date;
}

const invitationSchema: Schema<IInvitation> = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    role: { type: String, required: true, enum: ['employé', 'admin'] },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'declined'] },
    token: { type: String, required: true },
  },
  { timestamps: true }
);

export const Invitation = mongoose.model<IInvitation>('Invitation', invitationSchema);
