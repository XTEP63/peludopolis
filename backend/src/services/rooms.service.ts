import * as roomsRepository from "../repositories/rooms.repository";
import { NotFoundError, ValidationError } from "../utils/errors";
import { PetTypeAllowed, RoomSizeAllowed } from "../repositories/rooms.repository";

const PET_TYPES = ["perro", "gato", "reptil", "ambos"] as const;
const ROOM_SIZES = ["pequeno", "mediano", "grande", "todos"] as const;

const isValidPetType = (value: unknown): value is PetTypeAllowed => {
    return typeof value === "string" && (PET_TYPES as readonly string[]).includes(value);
};

const isValidRoomSize = (value: unknown): value is RoomSizeAllowed => {
    return typeof value === "string" && (ROOM_SIZES as readonly string[]).includes(value);
};

const getStringQuery = (value: unknown): string | undefined => {
    return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
};

const getPositiveNumberQuery = (value: unknown, fieldName: string): number | undefined => {
    if (value === undefined || value === null || value === "") return undefined;

    const numberValue = Number(value);

    if (Number.isNaN(numberValue) || numberValue < 0) {
        throw new ValidationError(`${fieldName} debe ser un número mayor o igual a 0.`);
    }

    return numberValue;
};

const isValidDateString = (value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
};

const validateDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return;

    if (!startDate || !endDate) {
        throw new ValidationError("start_date y end_date deben enviarse juntos.");
    }

    if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
        throw new ValidationError("Las fechas deben tener formato YYYY-MM-DD.");
    }

    if (new Date(startDate) >= new Date(endDate)) {
        throw new ValidationError("end_date debe ser mayor que start_date.");
    }
};

export const getAvailableRooms = async (query: Record<string, unknown>) => {
    const petType = getStringQuery(query.pet_type_allowed ?? query.species);
    const size = getStringQuery(query.size_allowed ?? query.size);
    const maxPrice = getPositiveNumberQuery(query.max_price ?? query.maxPrice, "max_price");
    const startDate = getStringQuery(query.start_date ?? query.startDate);
    const endDate = getStringQuery(query.end_date ?? query.endDate);

    if (petType !== undefined && !isValidPetType(petType)) {
        throw new ValidationError(`pet_type_allowed debe ser uno de: ${PET_TYPES.join(", ")}.`);
    }

    if (size !== undefined && !isValidRoomSize(size)) {
        throw new ValidationError(`size_allowed debe ser uno de: ${ROOM_SIZES.join(", ")}.`);
    }

    validateDateRange(startDate, endDate);

    return roomsRepository.findAvailableRooms({
        pet_type_allowed: petType,
        size_allowed: size,
        max_price: maxPrice,
        start_date: startDate,
        end_date: endDate
    });
};

export const getAvailableRoomById = async (id: number) => {
    if (!Number.isInteger(id) || id <= 0) {
        throw new ValidationError("El id de la habitación debe ser un entero positivo.");
    }

    const room = await roomsRepository.findAvailableRoomById(id);

    if (!room) {
        throw new NotFoundError("Habitación no encontrada o no disponible.");
    }

    return room;
};
