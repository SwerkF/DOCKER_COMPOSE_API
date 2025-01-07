import { Request, Response } from "express";
import { formatResponse } from "@/utils/responseFormatter";
import { WorkingHour } from "@/models/workingHoursModel";

/**
 * Add new working hours (recurring or exceptional).
 */
export const createWorkingHours = async (req: Request, res: Response) => {
  const { userId, startTime, endTime, isRecurring, date, day } = req.body;

  try {
    const workingHours = new WorkingHour({
      userId,
      startTime,
      endTime,
      isRecurring,
      date,
      day,
    });

    await workingHours.save();
    res.status(201).json(formatResponse("Horaires ajoutés avec succès.", workingHours));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de l'ajout des horaires.", error));
  }
};

/**
 * Retrieve working hours for an employee.
 */
export const getWorkingHours = async (req: Request, res: Response) => {
  const { userId, isRecurring } = req.query;

  try {
    const filter: any = { };
    if(userId) filter.userId = userId;
    if (isRecurring !== undefined) filter.isRecurring = isRecurring === "true";


    const workingHours = await WorkingHour.find(filter).populate("userId", "name email");

    res.status(200).json(formatResponse("Horaires récupérés avec succès.", workingHours));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la récupération des horaires.", error));
  }
};

/**
 * Update specific working hours.
 */
export const updateWorkingHours = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const workingHours = await WorkingHour.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!workingHours) {
      res.status(404).json(formatResponse("Horaires introuvables."));
      return;
    }

    res.status(200).json(formatResponse("Horaires mis à jour avec succès.", workingHours));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la mise à jour des horaires.", error));
  }
};

/**
 * Delete specific working hours.
 */
export const deleteWorkingHours = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const workingHours = await WorkingHour.findByIdAndDelete(id);

    if (!workingHours) {
      res.status(404).json(formatResponse("Horaires introuvables."));
      return;
    }

    res.status(200).json(formatResponse("Horaires supprimés avec succès.", workingHours));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la suppression des horaires.", error));
  }
};
