import { Booking } from "@/models/bookingModel";
import { User } from "@/models/userModel";

/**
 * Récupère le total des réservations.
 */
export const getTotalBookings = async (filter: any): Promise<number> => {
  return Booking.countDocuments(filter);
};

/**
 * Récupère le total des clients.
 */
export const getTotalClients = async (): Promise<number> => {
  return User.countDocuments({ role: "client" });
};

/**
 * Récupère le chiffre d'affaires total.
 */
export const getTotalRevenue = async (filter: any): Promise<number> => {
  const result = await Booking.aggregate([
    { $match: filter },
    { $group: { _id: null, total: { $sum: "$price" } } },
  ]);

  return result[0]?.total || 0;
};

/**
 * Récupère la répartition des statuts des réservations.
 */
export const getReservationStatus = async (filter: any) => {
  
  return Booking.aggregate([
    { $match: filter },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
};

/**
 * Récupère la répartition par catégories de services.
 */
export const getServiceDistribution = async (filter: any) => {
  const result = await Booking.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    {
      $group: {
        _id: "$service._id",
        description: { $first: "$service.description" },
        price: { $first: "$service.price" },
        duration: { $first: "$service.duration" },
        category: { $first: "$service.name" },
        isActive: { $first: "$service.isActive" },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return result.map((item) => ({
    name: item.name,
    description: item.description,
    price: item.price,
    duration: item.duration,
    category: item.category,
    isActive: item.isActive,
    count: item.count,
  }));
};

/**
 * Récupère l'évolution des revenus et des réservations.
 */
export const getRevenueEvolution = async (filter: any) => {
  const result = await Booking.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    {
      $group: {
        _id: { month: { $month: "$date" }, year: { $year: "$date" } },
        revenue: { $sum: { $multiply: ["$service.price", 1] } },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  console.log('Résultat de getRevenueEvolution:', result);
  

  return result.map((item) => ({    
    date: new Date(item._id.year, item._id.month, 1),
    revenue: item.revenue,
    reservations: item.bookings,
  }));
};

/**
 * Récupère les mots les plus fréquents dans les notes des réservations.
 */
export const getWordCloudData = async (filter: any) => {
  const result = await Booking.aggregate([
    { $match: filter },
    { $match: { message: { $exists: true, $ne: "" } } },
    {
      $project: {
        words: {
          $split: [
            {
              $reduce: {
                input: {
                  $map: {
                    input: { $split: ['$message', ' '] },
                    as: 'word',
                    in: {
                      $trim: { input: '$$word', chars: '.,!?;:' }
                    },
                  },
                },
                initialValue: '',
                in: {
                  $concat: ['$$value', ' ', '$$this'],
                },
              },
            },
            ' ',
          ],
        },
      },
    },
    { $unwind: '$words' },
    {
      $match: {
        $expr: {
          $gte: [{ $strLenCP: '$words' }, 4],
        },
      },
    },
    {
      $group: {
        _id: { $toLower: '$words' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  return result.map((item) => ({
    label: item._id,
    count: item.count,
  }));
};

/**
 * Récupère les clients les plus fidèles.
 */
export const getTopClients = async (filter: any) => {
  const result = await Booking.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    {
      $group: {
        _id: "$clientId",
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: "$service.price" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $sort: { totalBookings: -1 } },
    { $limit: 10 },
  ]);

  return result.map((item) => ({
    firstName: item.user.firstName,
    lastName: item.user.lastName,
    email: item.user.email,
    role: item.user.role,
    reservations: item.totalBookings,
    totalSpent: item.totalRevenue,
  }));
};
