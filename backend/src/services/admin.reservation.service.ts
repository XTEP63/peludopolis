import * as repo from "../repositories/admin.reservations.repository";
import { ReservationRow } from "../repositories/admin.reservations.repository";
import { NotFoundError } from "../utils/errors";

/* GET - Todas las reservaciones */
export const getAllReservations = async (filters: {
    date?:   string;
    user?:   string;
    status?: ReservationRow["reservation_status"];
}) => {
    return repo.findAllReservations(filters);
};

/* GET - Una reservación por id */
export const getReservationById = async (id: number) => {
    const reservation = await repo.findReservationById(id);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    return reservation;
};

/* PATCH - Cambiar el status de una reservación */
export const updateReservationStatus = async (id: number, reservation_status: ReservationRow["reservation_status"]) => {
    const reservation = await repo.findReservationById(id);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    return repo.updateReservationStatusById(id, reservation_status);
};

/* PATCH - Confirmar check-in */
export const confirmCheckIn = async (id: number) => {
    const reservation = await repo.findReservationById(id);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    return repo.confirmCheckIn(id);
};

/* PATCH - Confirmar check-out */
export const confirmCheckOut = async (id: number) => {
    const reservation = await repo.findReservationById(id);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    return repo.confirmCheckOut(id);
};