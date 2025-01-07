import { Request, Response } from "express";
import { Invitation } from "@/models/invitationModel";
import { formatResponse } from "@/utils/responseFormatter";

/**
 * Create a new invitation.
 */
export const createInvitation = async (req: Request, res: Response) => {
  const { email, role } = req.body;

  try {
    const invitation = new Invitation({ email, role, status: "pending" });
    await invitation.save();

    res.status(201).json(formatResponse("Invitation envoyée avec succès.", invitation));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de l'envoi de l'invitation.", error));
  }
};

/**
 * Retrieve an invitation by ID.
 */
export const getInvitation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const invitation = await Invitation.findById(id);

    if (!invitation) {
      res.status(404).json(formatResponse("Invitation introuvable."));
      return;
    }

    res.status(200).json(formatResponse("Invitation récupérée avec succès.", invitation));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la récupération de l'invitation.", error));
  }
};

/**
 * Update the status of an invitation.
 */
export const updateInvitation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const invitation = await Invitation.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!invitation) {
      res.status(404).json(formatResponse("Invitation introuvable."));
      return;
    }

    res.status(200).json(formatResponse("Invitation mise à jour avec succès.", invitation));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la mise à jour de l'invitation.", error));
  }
};

/**
 * Delete an invitation by ID.
 */
export const deleteInvitation = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const invitation = await Invitation.findByIdAndDelete(id);

    if (!invitation) {
      res.status(404).json(formatResponse("Invitation introuvable."));
      return;
    }

    res.status(200).json(formatResponse("Invitation révoquée avec succès.", invitation));
  } catch (error) {
    res.status(500).json(formatResponse("Erreur lors de la révocation de l'invitation.", error));
  }
};
