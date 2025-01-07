import { Request, Response } from "express";
import { Parameter } from "@/models/parameterModel";

/**
 * Get company parameters.
 * @returns The current company parameters.
 * 
 * Response Format:
 * - `name`: (string) The name of the company.
 * - `description`: (string) A brief description of the company.
 * - `logoUrl`: (string) [Optional] URL of the company's logo.
 * - `address`: (string) [Optional] Physical address of the company.
 * - `phone`: (string) [Optional] Phone number for company contact.
 * - `email`: (string) [Optional] Email address for company inquiries.
 * - `websiteUrl`: (string) [Optional] The company's website URL.
 * - `socialMediaUrls`: (object) [Optional] Social media links:
 *    - `facebook`: URL of the company's Facebook page.
 *    - `twitter`: URL of the company's Twitter profile.
 *    - `linkedin`: URL of the company's LinkedIn profile.
 *    - `instagram`: URL of the company's Instagram profile.
 */
export const getParameters = async (req: Request, res: Response): Promise<void> => {
  try {
    const parameters = await Parameter.findOne(); // Supposes only one entry exists
    if (!parameters) {
      res.status(404).json({ message: "Paramètres non trouvés." });
      return;
    }
    res.status(200).json(parameters);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des paramètres.", error });
  }
};

/**
 * Update company parameters.
 * @body {string} name - The name of the company.
 * @body {string} description - A brief description of the company.
 * @body {string} [logoUrl] - URL of the company's logo.
 * @body {string} [address] - Physical address of the company.
 * @body {string} [phone] - Phone number for company contact.
 * @body {string} [email] - Email address for company inquiries.
 * @body {string} [websiteUrl] - The company's website URL.
 * @body {object} [socialMediaUrls] - Social media links:
 *    - `facebook` (string): URL of the company's Facebook page.
 *    - `twitter` (string): URL of the company's Twitter profile.
 *    - `linkedin` (string): URL of the company's LinkedIn profile.
 *    - `instagram` (string): URL of the company's Instagram profile.
 * 
 * Response Format:
 * - Updated parameter object.
 */
export const updateParameters = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedParameters = await Parameter.findOneAndUpdate(
      {}, // Empty filter since there's only one entry
      req.body,
      { new: true, upsert: true } // Create if not exists
    );
    res.status(200).json({ message: "Paramètres mis à jour avec succès.", updatedParameters });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres.", error });
  }
};
