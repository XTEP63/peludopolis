import { Request, Response, NextFunction } from "express";
import * as service from "../services/admin.users.service";

/* GET ALL */
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await service.getAllUsers(req.query);
        res.json({ ok: true, data: users });
    } catch (err) { next(err); }
};

/* GET BY ID */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await service.getUserById(Number(req.params.id));

        res.json({ ok: true, data: user });
    } catch (err) { next(err); }
};

/* PATCH USER */
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const updated = await service.updateUser(Number(req.params.id), req.body);

        res.json({ ok: true, data: updated });
    } catch (err) { next(err); }
};

/* PATCH STATUS */
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const updated = await service.updateUserStatus(Number(req.params.id), req.body.status);

        res.json({ ok: true, data: updated });
    } catch (err) { next(err); }
};

/* GET BY ID PET */
export const getUserPets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { species } = req.query;

        const pets = await service.getUserPets(Number(req.params.id), typeof species === "string" ? species : undefined);

        res.json({ ok: true, data: pets });
    } catch (err) { next(err); }
};