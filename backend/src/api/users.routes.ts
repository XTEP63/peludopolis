import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/users.controller";
import * as ctrl from "../controllers/user.pets.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { validateCreatePet, validatePatchPet, validateIdParam } from "../middlewares/user.middlewares";

const router = Router()

// USERS
router.get("/me", verifyToken, getProfile)
router.patch("/me", verifyToken, updateProfile)

// PETS
router.get("/pets",     verifyToken, ctrl.getAll);
router.get("/pets/:id", verifyToken, validateIdParam, ctrl.getById);
router.post("/pets",     verifyToken, validateCreatePet,              ctrl.create);
router.patch("/pets/:id", verifyToken, validateIdParam, validatePatchPet, ctrl.update);
router.delete("/pets/:id", verifyToken, validateIdParam,                ctrl.deactivate);

export default router;