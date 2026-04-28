import { Router } from "express";
import * as ctrl from "../controllers/admin.users.controller";
import { verifyToken, isAdmin  } from "../middlewares/auth.middleware";
import {
    validateUserFilters,
    validatePatchUser,
    validateUserStatus,
    validateIdParam,
    validatePetsFilters
} from "../middlewares/admin.middlewares";


const router = Router();

router.get(
    "/users",
    verifyToken,
    isAdmin,
    validateUserFilters,
    ctrl.getAll
);

router.get(
    "/users/:id",
    verifyToken,
    isAdmin,
    validateIdParam,
    ctrl.getById
);

router.patch(
    "/users/:id",
    verifyToken,
    isAdmin,
    validateIdParam,
    validatePatchUser,
    ctrl.update
);

router.patch(
    "/users/:id/status",
    verifyToken,
    isAdmin,
    validateIdParam,
    validateUserStatus,
    ctrl.updateStatus
);

router.get(
    "/users/:id/pets",
    verifyToken,
    isAdmin,
    validateIdParam,
    validatePetsFilters,
    ctrl.getUserPets
);

export default router;