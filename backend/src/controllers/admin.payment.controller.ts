import { Request, Response, NextFunction } from "express";
import * as service from "../services/admin.payment.service";

/* GET ALL PAYMENTS */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await service.getAllPayments(req.query);
        res.json({ ok: true, data: payments });
    } catch (err) { next(err); }
};