import * as repo from "../repositories/user.pets.repository";
import { PetRow } from "../repositories/user.pets.repository";
import { NotFoundError, ForbiddenError } from "../utils/errors";

//PICK - de todo este objeto solo quiero
//PARTIAL - Hazlos opcionales ?

/* GET - Todas las mascotas del usuario autenticado */
export const getMyPets = async (userId: number) => {
    return repo.findPetsByUserId(userId);
};

/* GET - Ver una mascota en específico */
export const getPetById = async (id: number, userId: number) => {
    const pet = await repo.findPetById(id);

    if (!pet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    if (pet.user_id !== userId) {
        throw new ForbiddenError("No tienes permiso para ver esta mascota.");
    }

    return pet;
};

/* POST - Crear una mascota */
export const createPet = async (
    userId: number,
    data: Pick<PetRow, "name" | "species" | "size"> &
        Partial<Pick<PetRow, "breed" | "age" | "weight" | "sex" | "color" | "allergies" | "notes">>
) => {
    return repo.createPet({ ...data, user_id: userId });
};

/* PATCH - Editar una mascota */
export const updatePet = async (
    id:     number,
    userId: number,
    fields: Partial<Pick<PetRow, "name" | "species" | "breed" | "age" | "weight" | "size" | "sex" | "color" | "allergies" | "notes">>
) => {
    const pet = await repo.findPetById(id);

    if (!pet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    if (pet.user_id !== userId) {
        throw new ForbiddenError("No tienes permiso para editar esta mascota.");
    }

    return repo.updatePetById(id, fields);
};

/* DELETE - Borrar una mascota :( */
export const deactivatePet = async (id: number, userId: number) => {
    const pet = await repo.findPetById(id);

    if (!pet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    if (pet.user_id !== userId) {
        throw new ForbiddenError("No tienes permiso para eliminar esta mascota.");
    }

    return repo.deactivatePetById(id);
};