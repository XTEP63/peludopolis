import { Router } from "express"
import { getProfile, updateProfile } from "../controllers/users.controller"
import { verifyToken } from "../middlewares/auth.middleware"

const router = Router()

router.get("/me", verifyToken, getProfile)
router.patch("/me", verifyToken, updateProfile)

export default router