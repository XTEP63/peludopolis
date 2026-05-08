import { Request, Response, NextFunction } from "express";
import * as paymentsService from "../services/payments.service";

const getAuthenticatedUserId = (req: Request): number => {
    return Number(req.user?.sub);
};

export const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const payment = await paymentsService.createPayment(userId, req.body);

        res.status(201).json({
            ok: true,
            message: "Pago registrado correctamente",
            data: payment
        });
    } catch (error) {
        next(error);
    }
};

export const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const payments = await paymentsService.getMyPayments(userId);

        res.status(200).json({
            ok: true,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentsByReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const reservationId = Number(req.params.reservationId);
        const payments = await paymentsService.getPaymentsByReservationForUser(userId, reservationId);

        res.status(200).json({
            ok: true,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};

export const getAllPaymentsForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await paymentsService.getAllPaymentsForAdmin(req.query);

        res.status(200).json({
            ok: true,
            data: payments
        });
    } catch (error) {
        next(error);
    }
};

export const getPaymentByIdForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const paymentId = Number(req.params.id);
        const payment = await paymentsService.getPaymentByIdForAdmin(paymentId);

        res.status(200).json({
            ok: true,
            data: payment
        });
    } catch (error) {
        next(error);
    }
};
