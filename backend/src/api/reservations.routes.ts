import { Router } from "express"
import { verifyToken } from "../middlewares/auth.middleware"
import * as reservationsController from "../controllers/reservations.controller"
import { validateIdParam } from "../middlewares/admin.middlewares"

const router = Router()

router.post("/", verifyToken, reservationsController.createReservation)
router.get("/me", verifyToken, reservationsController.getMyReservations)
router.get("/:id", verifyToken, validateIdParam, reservationsController.getMyReservationById)
router.patch("/:id/cancel", verifyToken, validateIdParam, reservationsController.cancelMyReservation)

export default router