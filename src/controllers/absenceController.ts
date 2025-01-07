import { Request, Response } from "express";
import { Absence } from "@/models/absenceModel";
import { formatResponse } from "@/utils/responseFormatter";

/**
 * Add a new absence.
 */
export const createAbsence = async (req: Request, res: Response) => {
  const { userId, startDate, endDate, reason } = req.body;

  try {
    const absence = new Absence({ userId, startDate, endDate, reason });
    await absence.save();

    res.status(201).json(formatResponse("Absence ajoutée avec succès.", absence));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de l'ajout de l'absence.", error));
  }
};

/**
 * Retrieve absences with optional filters.
 */
export const getAbsences = async (req: Request, res: Response) => {
  const { userId, startDate, endDate } = req.query;

  try {
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (startDate || endDate) filter.startDate = {};
    if (startDate) filter.startDate.$gte = new Date(startDate as string);
    if (endDate) filter.startDate.$lte = new Date(endDate as string);

    const absences = await Absence.find(filter);
    res.status(200).json(formatResponse("Absences récupérées avec succès.", absences));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la récupération des absences.", error));
  }
};

/**
 * Update an absence by ID.
 */
export const updateAbsence = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const absence = await Absence.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!absence) {
      res.status(404).json(formatResponse("Absence introuvable."));
      return;
    }

    res.status(200).json(formatResponse("Absence mise à jour avec succès.", absence));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la mise à jour de l'absence.", error));
  }
};

/**
 * Delete an absence by ID.
 */
export const deleteAbsence = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const absence = await Absence.findByIdAndDelete(id);

    if (!absence) {
      res.status(404).json(formatResponse("Absence introuvable."));
      return;
    }

    res.status(200).json(formatResponse("Absence supprimée avec succès.", absence));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la suppression de l'absence.", error));
  }
};
