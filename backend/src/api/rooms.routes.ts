import { Router } from "express";
import * as roomsController from "../controllers/rooms.controller";

const router = Router();

router.get("/", roomsController.getAvailableRooms);
router.get("/:id", roomsController.getAvailableRoomById);

export default router;
