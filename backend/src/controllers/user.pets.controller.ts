import { Request, Response, NextFunction } from "express";
import * as service from "../services/user.pets.service";

/* GET ALL MASCOTAS */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pets = await service.getMyPets(Number(req.user?.sub));
        res.json({ ok: true, data: pets });
    } catch (err) { next(err); }
};

/* GET MASCOTA POR ID */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await service.getPetById(Number(req.params.id), Number(req.user?.sub));
        res.json({ ok: true, data: pet });
    } catch (err) { next(err); }
};

/* CREAR UNA MASCOTA */
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await service.createPet(Number(req.user?.sub), req.body);
        res.status(201).json({ ok: true, data: pet });
    } catch (err) { next(err); }
};

/* EDITAR MASCOTA */
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await service.updatePet(Number(req.params.id), Number(req.user?.sub), req.body);
        res.json({ ok: true, data: updated });
    } catch (err) { next(err); }
};

/* BORRARLA */
export const deactivate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await service.deactivatePet(Number(req.params.id), Number(req.user?.sub));
        res.json({ ok: true, data: result });
    } catch (err) { next(err); }
};