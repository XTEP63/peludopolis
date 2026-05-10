import { Request, Response, NextFunction } from "express";
import * as roomsService from "../services/rooms.service";

export const getAvailableRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rooms = await roomsService.getAvailableRooms(req.query);

        res.status(200).json({
            ok: true,
            data: rooms
        });
    } catch (error) {
        next(error);
    }
};

export const getAvailableRoomById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomId = Number(req.params.id);
        const room = await roomsService.getAvailableRoomById(roomId);

        res.status(200).json({
            ok: true,
            data: room
        });
    } catch (error) {
        next(error);
    }
};
