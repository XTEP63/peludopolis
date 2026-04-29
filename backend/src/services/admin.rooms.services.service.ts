import * as repo from "../repositories/admin.rooms.services.repository";
import {RoomRow,ServiceRow,} from "../repositories/admin.rooms.services.repository";
import { NotFoundError } from "../utils/errors";

//PICK - de todo este objeto solo quiero
//PARTIAL - Hazlos opcionales ?

// COSAS DE LAS HABITACIONES

/* GET - Todas las habitaciones con filtros opcionales */
export const getAllRooms = async (filters: {
    status?:           RoomRow["status"];
    pet_type_allowed?: RoomRow["pet_type_allowed"];
    size_allowed?:     RoomRow["size_allowed"];
}) => {
    return repo.findAllRooms(filters);
};

/* GET - Encontrar la habitación por id */
export const getRoomById = async (id: number) => {
    const room = await repo.findRoomById(id);

    if (!room) {
        throw new NotFoundError("Habitación no encontrada.");
    }

    return room;
};

/* POST - Crear una habitación */
export const createRoom = async (
    // campos obligatorios + opcionales separados
    data: Pick<RoomRow, "name" | "pet_type_allowed" | "size_allowed" | "capacity" | "price_per_night"> & {
        description?: string | null;
        image_url?:   string | null;
    }
) => {
    return repo.createRoom(data);
};

/* PATCH - Actualizar campos de una habitación */
export const updateRoom = async (
    id:     number,
    fields: Partial<Pick<RoomRow, "name" | "pet_type_allowed" | "size_allowed" | "capacity" | "price_per_night" | "description" | "image_url">>) => {
    const room = await repo.findRoomById(id);

    if (!room) {
        throw new NotFoundError("Habitación no encontrada.");
    }

    return repo.updateRoomById(id, fields);
};

/* PATCH - Cambiar solo el status de una habitación */
export const updateRoomStatus = async (
    id:     number,
    status: RoomRow["status"]
) => {
    const room = await repo.findRoomById(id);

    if (!room) {
        throw new NotFoundError("Habitación no encontrada.");
    }

    return repo.updateRoomStatusById(id, status);
};

/* DELETE - Eliminar una habitación */
export const deleteRoom = async (id: number) => {
    const room = await repo.findRoomById(id);

    if (!room) {
        throw new NotFoundError("Habitación no encontrada.");
    }

    await repo.deleteRoomById(id);
};

// COSAS DE LOS SERVICIOS

/* GET - Todos los servicios con filtros opcionales */
export const getAllServices = async (filters: {
    status?:       ServiceRow["status"];
    service_type?: string;
}) => {
    return repo.findAllServices(filters);
};

/* GET - Un servicio por id */
export const getServiceById = async (id: number) => {
    const service = await repo.findServiceById(id);

    if (!service) {
        throw new NotFoundError("Servicio no encontrado.");
    }

    return service;
};

/* POST - Crear un servicio */
export const createService = async (
    // Igual OB + OP
    data: Pick<ServiceRow, "name" | "price"> & {
        description?:  string | null;
        service_type?: string | null;
    }
) => {
    return repo.createService(data);
};

/* PATCH - Actualizar campos de un servicio */
export const updateService = async (
    id:     number,
    fields: Partial<Pick<ServiceRow, "name" | "description" | "price" | "service_type" | "status">>) => {
    const service = await repo.findServiceById(id);

    if (!service) {
        throw new NotFoundError("Servicio no encontrado.");
    }

    return repo.updateServiceById(id, fields);
};

/* DELETE - Eliminar un servicio */
export const deleteService = async (id: number) => {
    const service = await repo.findServiceById(id);

    if (!service) {
        throw new NotFoundError("Servicio no encontrado.");
    }

    await repo.deleteServiceById(id);
};