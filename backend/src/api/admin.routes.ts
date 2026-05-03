import { Router } from "express";
import * as usersCtrl from "../controllers/admin.users.controller";
import * as roomsCtrl from "../controllers/admin.rooms.services.controllers";
import * as resCtrl from "../controllers/admin.reservations.controller";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware";
import {
    validateUserFilters, validatePatchUser, validateUserStatus, validatePetsFilters,
    validateRoomFilters, validateCreateRoom, validatePatchRoom, validateRoomStatus,
    validateServiceFilters, validateCreateService, validatePatchService,
    validateIdParam, validateReservationFilters, validateReservationStatus
} from "../middlewares/admin.middlewares";

const router = Router();

// USERS
router.get   ("/users",              verifyToken, isAdmin, validateUserFilters,    usersCtrl.getAll);
router.get   ("/users/:id",          verifyToken, isAdmin, validateIdParam,        usersCtrl.getById);
router.patch ("/users/:id",          verifyToken, isAdmin, validateIdParam, validatePatchUser,   usersCtrl.update);
router.patch ("/users/:id/status",   verifyToken, isAdmin, validateIdParam, validateUserStatus,  usersCtrl.updateStatus);
router.get   ("/users/:id/pets",     verifyToken, isAdmin, validateIdParam, validatePetsFilters, usersCtrl.getUserPets);

// ROOMS
router.get   ("/rooms",              verifyToken, isAdmin, validateRoomFilters,    roomsCtrl.getAllRooms);
router.get   ("/rooms/:id",          verifyToken, isAdmin, validateIdParam,        roomsCtrl.getRoomById);
router.post  ("/rooms",              verifyToken, isAdmin, validateCreateRoom,     roomsCtrl.createRoom);
router.patch ("/rooms/:id",          verifyToken, isAdmin, validateIdParam, validatePatchRoom,   roomsCtrl.updateRoom);
router.delete("/rooms/:id",          verifyToken, isAdmin, validateIdParam,        roomsCtrl.deleteRoom);
router.patch ("/rooms/:id/status",   verifyToken, isAdmin, validateIdParam, validateRoomStatus,  roomsCtrl.updateRoomStatus);

// SERVICES
router.get   ("/services",           verifyToken, isAdmin, validateServiceFilters,  roomsCtrl.getAllServices);
router.get   ("/services/:id",       verifyToken, isAdmin, validateIdParam,         roomsCtrl.getServiceById);
router.post  ("/services",           verifyToken, isAdmin, validateCreateService,   roomsCtrl.createService);
router.patch ("/services/:id",       verifyToken, isAdmin, validateIdParam, validatePatchService, roomsCtrl.updateService);
router.delete("/services/:id",       verifyToken, isAdmin, validateIdParam,         roomsCtrl.deleteService);


// RESERVATIONS
router.get   ("/reservations",                       verifyToken, isAdmin, validateReservationFilters,  resCtrl.getAll);
router.get   ("/reservations/:id",                   verifyToken, isAdmin, validateIdParam,             resCtrl.getById);
router.patch ("/reservations/:id/status",            verifyToken, isAdmin, validateIdParam, validateReservationStatus, resCtrl.updateStatus);
router.patch ("/reservations/:id/check-in/confirm",  verifyToken, isAdmin, validateIdParam,             resCtrl.checkIn);
router.patch ("/reservations/:id/check-out/confirm", verifyToken, isAdmin, validateIdParam,             resCtrl.checkOut);
export default router;