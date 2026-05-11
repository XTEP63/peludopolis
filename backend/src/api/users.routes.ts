import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/users.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { validateCreatePet, validatePatchPet, validateIdParam } from "../middlewares/user.middlewares";

const router = Router()

// USERS
router.get("/me", verifyToken, getProfile)
router.patch("/me", verifyToken, updateProfile)

export default router;