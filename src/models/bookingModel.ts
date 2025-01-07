import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  serviceId: mongoose.Schema.Types.ObjectId; // Référence à un service
  userId: mongoose.Schema.Types.ObjectId; // Référence à un employé
  clientId: mongoose.Schema.Types.ObjectId; // Référence à un client
  date: Date; // Date et heure de la réservation
  status: 'pending' | 'confirmed' | 'cancelled'; // Statut
  message?: string; // Instructions spéciales
  time?: string; // Heure de la réservation
  parent?: mongoose.Schema.Types.ObjectId; // Référence à une réservation parente (faire des rendez-vous de 1h, 1h30, rendez-vous de groupe)
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema: Schema<IBooking> = new Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    time : { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
