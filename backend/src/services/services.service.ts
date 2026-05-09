import * as servicesRepository from "../repositories/services.repository";
import { NotFoundError, ValidationError } from "../utils/errors";

const normalizeServiceType = (serviceType: unknown): string | undefined => {
    if (serviceType === undefined) return undefined;

    if (typeof serviceType !== "string" || !serviceType.trim()) {
        throw new ValidationError("service_type debe ser un texto válido.");
    }

    return serviceType.trim();
};

export const getActiveServices = async (filters: { service_type?: unknown }) => {
    return servicesRepository.findActiveServices({
        service_type: normalizeServiceType(filters.service_type)
    });
};

export const getActiveServiceById = async (id: number) => {
    const service = await servicesRepository.findActiveServiceById(id);

    if (!service) {
        throw new NotFoundError("Servicio no encontrado.");
    }

    return service;
};
