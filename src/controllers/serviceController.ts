import { Request, Response } from "express";
import { Service } from "@/models/serviceModel";
import { formatResponse } from "@/utils/responseFormatter";

/**
 * Create a new service.
 * @param req.body.name - Name of the service.
 * @param req.body.description - Description of the service.
 * @param req.body.duration - Duration of the service in minutes.
 * @param req.body.price - Price of the service.
 */
export const createService = async (req: Request, res: Response) => {
  const { name, description, duration, price, category } = req.body;

  try {
    // Create and save the new service
    const newService = new Service({ name, description, duration, price, category });
    await newService.save();

    res.status(201).json(formatResponse("Service created successfully.", newService));
  } catch (error) {
    res.status(500).json(formatResponse("Error creating the service.", error));
  }
};

/**
 * Get services with optional filters.
 * @query isActive - Filter by active/inactive services.
 * @query name - Search for services by name.
 */
export const getServices = async (req: Request, res: Response) => {
  const { isActive, name } = req.query;

  console.log('isActive:', isActive);

  try {
    const filter: any = {};

    // Apply dynamic filters
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (name) filter.name = { $regex: name, $options: "i" }; // Case-insensitive search

    // Retrieve services based on filters
    const services = await Service.find(filter);

    res.status(200).json(formatResponse("Services retrieved successfully.", services));
  } catch (error) {
    res.status(500).json(formatResponse("Error retrieving services.", error));
  }
};

/**
 * Update a service by ID.
 * @param req.params.id - ID of the service to update.
 * @param req.body - Fields to update for the service.
 */
export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    // Find and update the service
    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    if (!service) {
      res.status(404).json(formatResponse("Service not found."));
      return;
    }

    res.status(200).json(formatResponse("Service updated successfully.", service));
  } catch (error) {
    res.status(500).json(formatResponse("Error updating the service.", error));
  }
};

/**
 * Delete a service by ID.
 * @param req.params.id - ID of the service to delete.
 */
export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find and delete the service
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      res.status(404).json(formatResponse("Service not found."));
      return;
    }

    res.status(200).json(formatResponse("Service deleted successfully.", service));
  } catch (error) {
    res.status(500).json(formatResponse("Error deleting the service.", error));
  }
};

/**
 * Toggle the activation state of a service.
 * @param req.params.id - ID of the service.
 * @param req.body.isActive - New activation state of the service.
 */
export const toggleServiceState = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    res.status(400).json(formatResponse("Invalid 'isActive' value. Must be true or false."));
    return;
  }

  try {
    // Find and update the activation state
    const service = await Service.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!service) {
      res.status(404).json(formatResponse("Service not found."));
      return;
    }

    const message = isActive
      ? "Service activated successfully."
      : "Service deactivated successfully.";

    res.status(200).json(formatResponse(message, service));
  } catch (error) {
    res.status(500).json(formatResponse("Error toggling the service state.", error));
  }
};
