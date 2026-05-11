import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { validateIdParam } from "../middlewares/admin.middlewares";
import * as petsController from "../controllers/pets.controller";

const router = Router();

router.get("/", verifyToken, petsController.getMyPets);
router.get("/:id", verifyToken, validateIdParam, petsController.getMyPetById);
router.post("/", verifyToken, petsController.createPet);
router.patch("/:id", verifyToken, validateIdParam, petsController.updateMyPet);
router.delete("/:id", verifyToken, validateIdParam, petsController.deleteMyPet);

export default router;
