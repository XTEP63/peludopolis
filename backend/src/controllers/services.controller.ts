import { Request, Response, NextFunction } from "express";
import * as servicesService from "../services/services.service";

export const getActiveServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await servicesService.getActiveServices({
            service_type: req.query.service_type
        });

        res.status(200).json({ ok: true, data: services });
    } catch (error) {
        next(error);
    }
};

export const getActiveServiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const service = await servicesService.getActiveServiceById(Number(req.params.id));

        res.status(200).json({ ok: true, data: service });
    } catch (error) {
        next(error);
    }
};
