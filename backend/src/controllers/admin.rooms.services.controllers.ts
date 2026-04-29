import { Request, Response, NextFunction } from "express";
import * as service from "../services/admin.rooms.services.service";

// Cosas de la shabitaciones

/* GET ALL ROOMS */
export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await service.getAllRooms(req.query);
        res.json({ ok: true, data: rooms });
    } catch (err) { next(err); }
};

/* GET ROOM BY ID */
export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const room = await service.getRoomById(Number(req.params.id));
        res.json({ ok: true, data: room });
    } catch (err) { next(err); }
};

/* POST ROOM */
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const room = await service.createRoom(req.body);
        res.status(201).json({ ok: true, data: room });
    } catch (err) { next(err); }
};

/* PATCH ROOM */
export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await service.updateRoom(Number(req.params.id), req.body);
        res.json({ ok: true, data: updated });
    } catch (err) { next(err); }
};

/* DELETE ROOM */
export const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await service.deleteRoom(Number(req.params.id));
        res.json({ ok: true, message: "Habitación eliminada correctamente." });
    } catch (err) { next(err); }
};

/* PATCH ROOM STATUS */
export const updateRoomStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await service.updateRoomStatus(Number(req.params.id), req.body.status);
        res.json({ ok: true, data: updated });
    } catch (err) { next(err); }
};

// Cosas de Servicios

/* GET ALL SERVICES */
export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await service.getAllServices(req.query);
        res.json({ ok: true, data: services });
    } catch (err) { next(err); }
};

/* GET SERVICE BY ID */
export const getServiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const svc = await service.getServiceById(Number(req.params.id));
        res.json({ ok: true, data: svc });
    } catch (err) { next(err); }
};

/* POST SERVICE */
export const createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const svc = await service.createService(req.body);
        res.status(201).json({ ok: true, data: svc });
    } catch (err) { next(err); }
};

/* PATCH SERVICE */
export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await service.updateService(Number(req.params.id), req.body);
        res.json({ ok: true, data: updated });
    } catch (err) { next(err); }
};

/* DELETE SERVICE */
export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await service.deleteService(Number(req.params.id));
        res.json({ ok: true, message: "Servicio eliminado correctamente." });
    } catch (err) { next(err); }
};