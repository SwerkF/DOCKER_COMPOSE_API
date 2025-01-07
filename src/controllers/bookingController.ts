import { Request, RequestHandler, Response } from "express";
import { Booking } from "@/models/bookingModel";
import { formatResponse } from "@/utils/responseFormatter";
import { User } from "@/models/userModel";
const bcrypt = require("bcryptjs");

/**
 * Create a new booking.
 * @param req.body.userId - ID of the user making the booking.
 * @param req.body.serviceId - ID of the service being booked.
 * @param req.body.date - Date of the booking.
 * @param req.body.time - Time of the booking.
 * @param req.body.firstName - First name of the client.
 * @param req.body.lastName - Last name of the client.
 * @param req.body.email - Email of the client.
 * @param req.body.phoneNumber - Phone number of the client.
 * @param req.body.postalCode - Postal code of the client.
 * @param req.body.message - Optional message for the booking.
 * @returns The created booking.
 */
export const createBooking = async (req: Request, res: Response) : Promise<any> => {
  const { 
      userId,
      serviceId,
      date,
      time,
      firstName,
      lastName,
      email,
      phoneNumber,
      postalCode,
      message,
  } = req.body;

  if(!userId || !serviceId || !date || !time) {
    return res.status(400).json(formatResponse("Tous les champs sont requis."));
  }

  let { user } = req as any;

  if(!user) {
    user = await User.findOne({
      email: email
    });

    if(user) {
      return res.status(400).json(formatResponse("Un utilisateur utilise déjà cet email."));
    } else {
      const randHardPassword = Math.random().toString(36).slice(-8);
      
      let hashedPassword = await bcrypt.hash(randHardPassword, 10);

      user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: "client",
        phoneNumber,
        postalCode
      });

      try {
        await user.save();
      } catch (error) {
        return res.status(500).json(formatResponse("Erreur lors de la création de l'utilisateur.", error));
      }
    }
  }

  try {
    // Create and save the booking
    console.log(user);
    const booking = new Booking({
      userId: userId,
      serviceId,
      clientId: user.id || user._id,
      date,
      time,
      message,
    });
    await booking.save();

    res.status(201).json(formatResponse("Réservation créée avec succès.", booking));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la création de la réservation.", error));
    }
};

/**
 * Retrieve bookings with optional filters.
 * @query userId - Filter bookings by user ID.
 * @query serviceId - Filter bookings by service ID.
 * @query dateFrom - Retrieve bookings starting from this date.
 * @query dateTo - Retrieve bookings up to this date.
 * @query status - Filter bookings by status.
 */
export const getBookings = async (req: Request, res: Response) => {
  const { userId, serviceId, dateFrom, dateTo, status } = req.query;

  try {
    const filter: any = {};

    // Apply filters based on query parameters
    if (userId) filter.userId = userId;
    if (serviceId) filter.serviceId = serviceId;
    if (dateFrom || dateTo) filter.date = {};
    if (dateFrom) filter.date.$gte = new Date(dateFrom as string);
    if (dateTo) filter.date.$lte = new Date(dateTo as string);
    if (status) filter.status = status;
   
    // Retrieve bookings with sorting by date
    const bookings = await Booking.find({ ...filter }).sort({ date: 1 }).select([
      "userId", "time", "date"
    ]);

    res.status(200).json(formatResponse("Liste des réservations récupérée.", bookings));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la récupération des réservations.", error));
  }
};

/**
 * Retrieve upcoming bookings (future reservations).
 * @query userId - Filter bookings by user ID.
 */
export const getUpcomingBookings = async (req: Request, res: Response) => {
  const { userId } = req.query;

  try {
    const filter: any = { date: { $gte: new Date() } };

    // Optionally filter by user ID
    if (userId) filter.userId = userId;

    const bookings = await Booking.find(filter).sort({ date: 1 });

    res.status(200).json(formatResponse("Liste des réservations à venir récupérée.", bookings));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la récupération des réservations à venir.", error));
  }
};

/**
 * Update a booking by its ID.
 * Only updates fields that are provided in the request body.
 * @param req.params.id - ID of the booking to update.
 * @param req.body - Fields to update for the booking.
 */
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Find and update the booking
    const booking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Apply schema validation
    });

    if (!booking) {
      res.status(404).json(formatResponse("Réservation introuvable."));
      return;
    }

    res.status(200).json(formatResponse("Réservation mise à jour avec succès.", booking));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la mise à jour de la réservation.", error));
  }
};

/**
 * Delete a booking by its ID.
 * @param req.params.id - ID of the booking to delete.
 */
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find and delete the booking
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      res.status(404).json(formatResponse("Réservation introuvable."));
      return;
    }

    res.status(200).json(formatResponse("Réservation supprimée avec succès.", booking));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la suppression de la réservation.", error));
  }
};
