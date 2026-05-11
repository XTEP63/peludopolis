import { Request, Response, NextFunction } from "express";
import * as petsService from "../services/pets.service";

const getAuthenticatedUserId = (req: Request): number => Number(req.user?.sub);

export const getMyPets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pets = await petsService.getMyPets(getAuthenticatedUserId(req), {
            species: req.query.species as string | undefined,
            status: req.query.status as string | undefined
        });

        res.status(200).json({ ok: true, data: pets });
    } catch (error) {
        next(error);
    }
};

export const getMyPetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petsService.getMyPetById(getAuthenticatedUserId(req), Number(req.params.id));

        res.status(200).json({ ok: true, data: pet });
    } catch (error) {
        next(error);
    }
};

export const createPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petsService.createPet(getAuthenticatedUserId(req), req.body);

        res.status(201).json({
            ok: true,
            message: "Mascota creada correctamente.",
            data: pet
        });
    } catch (error) {
        next(error);
    }
};

export const updateMyPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petsService.updateMyPet(getAuthenticatedUserId(req), Number(req.params.id), req.body);

        res.status(200).json({
            ok: true,
            message: "Mascota actualizada correctamente.",
            data: pet
        });
    } catch (error) {
        next(error);
    }
};

export const deleteMyPet = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pet = await petsService.deleteMyPet(getAuthenticatedUserId(req), Number(req.params.id));

        res.status(200).json({
            ok: true,
            message: "Mascota eliminada correctamente.",
            data: pet
        });
    } catch (error) {
        next(error);
    }
};
