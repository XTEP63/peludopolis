import { Request, Response } from "express";
import * as service from "../services/admin.users.service";

/* GET ALL */
export const getAll = async (req: Request, res: Response) => {
    const users = await service.getAllUsers(req.query);
    res.json({ ok: true, data: users });
};

/* GET BY ID */
export const getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const user = await service.getUserById(id);

    res.json({ ok: true, data: user });
};

/* PATCH USER */
export const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const updated = await service.updateUser(id, req.body);

    res.json({ ok: true, data: updated });
};

/* PATCH STATUS */
export const updateStatus = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const updated = await service.updateUserStatus(id, req.body.status);

    res.json({ ok: true, data: updated });
};

/* GET BY ID PET */
export const getUserPets = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const { species } = req.query;

    const pets = await service.getUserPets(userId, typeof species === "string" ? species : undefined);

    res.json({ok: true, data: pets});
};