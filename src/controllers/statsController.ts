// filepath: /c:/Users/Damien Lortie/Documents/PROJET-COCHON-DINDE-A-L-ABRI/backend/src/controllers/statsController.ts
import { Request, Response } from "express";
import {
  getTotalBookings,
  getTotalClients,
  getTotalRevenue,
  getReservationStatus,
  getServiceDistribution,
  getRevenueEvolution,
  getWordCloudData,
  getTopClients,
} from "@/services/statsService";
import { formatResponse } from "@/utils/responseFormatter";

export const getStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Récupérer les paramètres de la requête
    const { startDate, endDate, categories } = req.query;

    // Convertir les dates en objets Date
    const start = startDate ? new Date(startDate as string) : new Date("2000-01-01");
    const end = endDate ? new Date(endDate as string) : new Date();

    // Filtre pour les réservations
    const bookingFilter: any = { createdAt: { $gte: start, $lte: end } };
    if (categories) {
      const categoryArray = (categories as string).split(",");
      bookingFilter.serviceId = { $in: categoryArray };
    }

    console.log('Filtre appliqué dans getStats:', bookingFilter);

    // Appels des services
    const [
      totalBookings,
      totalClients,
      totalRevenue,
      reservationStatus,
      serviceDistribution,
      revenueEvolution,
      bookingNotes,
      topClients,
    ] = await Promise.all([
      getTotalBookings(bookingFilter),
      getTotalClients(),
      getTotalRevenue(bookingFilter),
      getReservationStatus(bookingFilter),
      getServiceDistribution(bookingFilter),
      getRevenueEvolution(bookingFilter),
      getWordCloudData(bookingFilter),
      getTopClients(bookingFilter),
    ]);

    // Envoi des résultats
    res.status(200).json(formatResponse("Statistiques récupérées avec succès.", {
      totalBookings,
      totalClients,
      totalRevenue,
      averageRevenue: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      reservationStatus,
      serviceDistribution,
      revenueEvolution,
      bookingNotes,
      topClients,
    }));
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques.", error });
  }
};