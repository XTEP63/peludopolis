import { Router } from "express";
import { validateIdParam } from "../middlewares/admin.middlewares";
import * as servicesController from "../controllers/services.controller";

const router = Router();

router.get("/", servicesController.getActiveServices);
router.get("/:id", validateIdParam, servicesController.getActiveServiceById);

export default router;
