import * as repo from "../repositories/reservations.repository";
import { NotFoundError, ValidationError } from "../utils/errors";

interface RawReservationService {
    serviceId?: unknown;
    service_id?: unknown;
    quantity?: unknown;
}

export interface CreateReservationInput {
    roomId?: unknown;
    room_id?: unknown;
    petIds?: unknown;
    pet_ids?: unknown;
    startDate?: unknown;
    start_date?: unknown;
    endDate?: unknown;
    end_date?: unknown;
    services?: RawReservationService[];
    notes?: unknown;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const toPositiveInteger = (value: unknown, fieldName: string): number => {
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue <= 0) {
        throw new ValidationError(`${fieldName} debe ser un entero positivo.`);
    }

    return numberValue;
};

const toDateString = (value: unknown, fieldName: string): string => {
    if (typeof value !== "string" || !DATE_RE.test(value)) {
        throw new ValidationError(`${fieldName} debe tener formato YYYY-MM-DD.`);
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
        throw new ValidationError(`${fieldName} debe ser una fecha válida.`);
    }

    return value;
};

const calculateNights = (startDate: string, endDate: string): number => {
    const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
    const end = new Date(`${endDate}T00:00:00.000Z`).getTime();
    const nights = Math.round((end - start) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
        throw new ValidationError("endDate debe ser posterior a startDate.");
    }

    return nights;
};

const normalizeServiceInput = (services: RawReservationService[] | undefined) => {
    if (!services) return [];

    if (!Array.isArray(services)) {
        throw new ValidationError("services debe ser un arreglo.");
    }

    const grouped = new Map<number, number>();

    for (const service of services) {
        const serviceId = toPositiveInteger(service.serviceId ?? service.service_id, "serviceId");
        const quantity = service.quantity === undefined ? 1 : toPositiveInteger(service.quantity, "quantity");

        grouped.set(serviceId, (grouped.get(serviceId) ?? 0) + quantity);
    }

    return Array.from(grouped.entries()).map(([serviceId, quantity]) => ({ serviceId, quantity }));
};

const isPetCompatibleWithRoom = (pet: repo.PetRow, room: repo.RoomRow): boolean => {
    const speciesMatches =
        room.pet_type_allowed === pet.species ||
        (room.pet_type_allowed === "ambos" && ["perro", "gato"].includes(pet.species));

    const sizeMatches = room.size_allowed === "todos" || room.size_allowed === pet.size;

    return speciesMatches && sizeMatches;
};

export const createReservation = async (userId: number, input: CreateReservationInput) => {
    const roomId = toPositiveInteger(input.roomId ?? input.room_id, "roomId");
    const startDate = toDateString(input.startDate ?? input.start_date, "startDate");
    const endDate = toDateString(input.endDate ?? input.end_date, "endDate");
    const nights = calculateNights(startDate, endDate);

    const rawPetIds = input.petIds ?? input.pet_ids;

    if (!Array.isArray(rawPetIds) || rawPetIds.length === 0) {
        throw new ValidationError("petIds debe ser un arreglo con al menos una mascota.");
    }

    const petIds = [...new Set(rawPetIds.map((petId) => toPositiveInteger(petId, "petId")))];
    const requestedServices = normalizeServiceInput(input.services);
    const notes = typeof input.notes === "string" && input.notes.trim() ? input.notes.trim() : null;

    const room = await repo.findRoomById(roomId);

    if (!room) {
        throw new NotFoundError("Habitación no encontrada.");
    }

    if (room.status !== "disponible") {
        throw new ValidationError("La habitación no está disponible para reservar.");
    }

    const pets = await repo.findPetsByIdsForUser(userId, petIds);

    if (pets.length !== petIds.length) {
        throw new ValidationError("Una o más mascotas no existen, no están activas o no pertenecen al usuario.");
    }

    if (pets.length > Number(room.capacity)) {
        throw new ValidationError("La cantidad de mascotas excede la capacidad de la habitación.");
    }

    const incompatiblePet = pets.find((pet) => !isPetCompatibleWithRoom(pet, room));

    if (incompatiblePet) {
        throw new ValidationError(`La mascota ${incompatiblePet.name} no es compatible con el tipo o tamaño permitido de la habitación.`);
    }

    const hasConflict = await repo.roomHasDateConflict(roomId, startDate, endDate);

    if (hasConflict) {
        throw new ValidationError("La habitación ya tiene una reservación activa en esas fechas.");
    }

    const services = await repo.findServicesByIds(requestedServices.map((service) => service.serviceId));

    if (services.length !== requestedServices.length) {
        throw new ValidationError("Uno o más servicios no existen o están inactivos.");
    }

    const serviceRows = requestedServices.map((requestedService) => {
        const service = services.find((item) => Number(item.id) === requestedService.serviceId);

        if (!service) {
            throw new ValidationError("Uno o más servicios no existen o están inactivos.");
        }

        const unitPrice = Number(service.price);
        const subtotal = unitPrice * requestedService.quantity;

        return {
            serviceId: requestedService.serviceId,
            quantity: requestedService.quantity,
            unitPrice,
            subtotal
        };
    });

    const roomTotal = Number(room.price_per_night) * nights;
    const servicesTotal = serviceRows.reduce((sum, service) => sum + service.subtotal, 0);
    const total = roomTotal + servicesTotal;

    return repo.createReservation({
        userId,
        roomId,
        petIds,
        startDate,
        endDate,
        total,
        notes,
        services: serviceRows
    });
};

export const getMyReservations = async (userId: number) => {
    return repo.findReservationsByUser(userId);
};

export const getMyReservationById = async (userId: number, reservationId: number) => {
    const reservation = await repo.findReservationByIdForUser(userId, reservationId);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    return reservation;
};

export const cancelMyReservation = async (userId: number, reservationId: number) => {
    const reservation = await repo.findReservationByIdForUser(userId, reservationId);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    if (!["pendiente", "confirmada"].includes(reservation.reservation_status)) {
        throw new ValidationError("Solo se pueden cancelar reservaciones pendientes o confirmadas.");
    }

    return repo.cancelReservationByIdForUser(userId, reservationId);
};
