import * as repo from "../repositories/admin.user.repository";
import { NotFoundError } from "../utils/errors";

/* GET- Todos */
export const getAllUsers = async (filters: any) => {
    return repo.findAllUsers(filters);
};

/* GET  Por id */
export const getUserById = async (id: number) => {
    const user = await repo.findUserById(id);

    if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
    }

    return user;
};

/* PATCH - Campos del usuario */
export const updateUser = async (id: number, fields: any) => {
    const user = await repo.findUserById(id);

    if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
    }

    return await repo.updateUserById(id, fields);
};

/* PATCH - Estatus del usuario */
export const updateUserStatus = async (id: number, status: any) => {
    const user = await repo.findUserById(id);

    if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
    }

    return await repo.updateUserStatusById(id, status);
};

/* GET - Obetner las mascotas de un usuario */
export const getUserPets = async (userId: number, species?: string) => {

    const user = await repo.findUserById(userId);

    if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
    }

    return await repo.findPetsByUserId(userId, species);
};