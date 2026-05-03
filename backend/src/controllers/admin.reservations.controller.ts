import { Request, Response, NextFunction } from "express";
import * as service from "../services/admin.reservation.service";

/* GET ALL RESERVATIONS */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reservations = await service.getAllReservations(req.query);
        res.json({ ok: true, data: reservations });
    } catch (err) { next(err); }
};

/* GET BY ID */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reservation = await service.getReservationById(Number(req.params.id));
        res.json({ ok: true, data: reservation });
    } catch (err) { next(err); }
};

/* PATCH STATUS */
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await service.updateReservationStatus(Number(req.params.id), req.body.reservation_status);
        res.json({ ok: true, data: updated });
    } catch (err) { next(err); }
};

/* PATCH CHECK-IN */
export const checkIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await service.confirmCheckIn(Number(req.params.id));
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
};

/* PATCH CHECK-OUT */
export const checkOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await service.confirmCheckOut(Number(req.params.id));
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
};