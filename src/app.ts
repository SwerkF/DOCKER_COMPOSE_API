import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./config/conn"; 
import { isAuthenticated } from "./middlewares/auth";
import { rateLimit } from "./middlewares/rateLimit";
import { errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/logger";

dotenv.config();

const app: Application = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Logger pour chaque requête
app.use(logger);

// Connexion à MongoDB
connect();

// Limitation des requêtes (100 requêtes par minute par IP)
app.use(rateLimit(100, 60 * 1000));

// Importation des routes
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import paramRoutes from "./routes/parameterRoutes";
import statsRoutes from "./routes/statsRoutes";
import invitationRoutes from "./routes/invitationRoutes";
import absenceRoutes from "./routes/absenceRoutes";
import workingHoursRoutes from "./routes/workingHoursRoutes";

// Utilisation des routes avec préfixes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/params", paramRoutes);
app.use("/api/stats", isAuthenticated, statsRoutes); // Protégé par authentification
app.use("/api/invitations", isAuthenticated, invitationRoutes); // Protégé par authentification
app.use("/api/absences", isAuthenticated, absenceRoutes); // Protégé par authentification
app.use("/api/working-hours", workingHoursRoutes); // Protégé par authentification

// Gestion des erreurs 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route non trouvée." });
});

// Middleware global pour la gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
