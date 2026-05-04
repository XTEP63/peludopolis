import { Request, Response, NextFunction } from "express";
import * as reservationsService from "../services/reservations.service";

const getAuthenticatedUserId = (req: Request): number => {
    return Number(req.user?.sub);
};

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const reservation = await reservationsService.createReservation(userId, req.body);

        res.status(201).json({
            ok: true,
            message: "Reservación creada correctamente",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
};

export const getMyReservations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const reservations = await reservationsService.getMyReservations(userId);

        res.status(200).json({
            ok: true,
            data: reservations
        });
    } catch (error) {
        next(error);
    }
};

export const getMyReservationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const reservationId = Number(req.params.id);
        const reservation = await reservationsService.getMyReservationById(userId, reservationId);

        res.status(200).json({
            ok: true,
            data: reservation
        });
    } catch (error) {
        next(error);
    }
};

export const cancelMyReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const reservationId = Number(req.params.id);
        const reservation = await reservationsService.cancelMyReservation(userId, reservationId);

        res.status(200).json({
            ok: true,
            message: "Reservación cancelada correctamente",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
};