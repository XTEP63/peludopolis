import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import * as paymentsController from "../controllers/payments.controller";

const router = Router();

router.post("/", verifyToken, paymentsController.createPayment);
router.get("/me", verifyToken, paymentsController.getMyPayments);
router.get("/reservation/:reservationId", verifyToken, paymentsController.getPaymentsByReservation);

export default router;
