import mongoose from 'mongoose';
import { User } from '../models/userModel';
import { Service } from '../models/serviceModel';
import { Booking } from '../models/bookingModel';
import { WorkingHour } from '../models/workingHoursModel';
import { Absence } from '../models/absenceModel';

// Remplacez par votre URI MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/express-mongo';

const seedDatabase = async () => {
  await mongoose.connect(mongoURI, {});

  // Vider les collections existantes
  await User.deleteMany({});
  await Service.deleteMany({});
  await Booking.deleteMany({});
  await WorkingHour.deleteMany({});
  await Absence.deleteMany({});

  // Créer des utilisateurs
  const adminUser = new User({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'hashedpassword', // À remplacer par un mot de passe haché
    role: 'admin',
  });

  const employeeUser = new User({
    firstName: 'Employé',
    lastName: 'User',
    email: 'employe@example.com',
    password: 'hashedpassword',
    role: 'employé',
  });

  const clientUser = new User({
    firstName: 'Client',
    lastName: 'User',
    email: 'client@example.com',
    password: 'hashedpassword',
    role: 'client',
  });

  await adminUser.save();
  await employeeUser.save();
  await clientUser.save();

  // Créer des services
  const haircutService = new Service({
    name: 'Coupe de Cheveux',
    description: 'Une coupe tendance',
    duration: 30,
    price: 25,
    isActive: true,
    users: [employeeUser._id],
  });

  const massageService = new Service({
    name: 'Massage',
    description: 'Un moment de détente',
    duration: 60,
    price: 70,
    isActive: true,
    users: [employeeUser._id],
  });

  await haircutService.save();
  await massageService.save();

  // Créer des réservations
  const booking = new Booking({
    userId: employeeUser._id,
    serviceId: haircutService._id,
    clientId: clientUser._id,
    date: new Date(),
    status: 'confirmed',
  });

  await booking.save();

  // Créer des horaires de travail
  const workingHour = new WorkingHour({
    userId: employeeUser._id,
    startTime: '09:00',
    endTime: '17:00',
    day: 'Monday',
    type: 'recurrent',
  });

  await workingHour.save();

  // Créer des absences
  const absence = new Absence({
    userId: employeeUser._id,
    startDate: new Date(),
    endDate: new Date(),
    reason: 'Vacances',
  });

  await absence.save();

  await mongoose.disconnect();
};

seedDatabase()
  .then(() => {
    console.log('Base de données initialisée avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'initialisation :', error);
    process.exit(1);
  });