import * as petsRepository from "../repositories/pets.repository";
import { NotFoundError, ValidationError } from "../utils/errors";
import { CreatePetData, PetSex, PetSize, PetSpecies, PetStatus, UpdatePetData } from "../repositories/pets.repository";

const VALID_SPECIES: PetSpecies[] = ["perro", "gato", "reptil"];
const VALID_SIZES: PetSize[] = ["pequeno", "mediano", "grande"];
const VALID_SEXES: PetSex[] = ["macho", "hembra"];
const VALID_STATUSES: PetStatus[] = ["activo", "inactivo"];

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const normalizeOptionalString = (value: unknown): string | null | undefined => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (typeof value !== "string") throw new ValidationError("Los campos de texto deben ser strings.");

    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
};

const normalizeOptionalNumber = (value: unknown, fieldName: string): number | null | undefined => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return null;

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue) || numberValue < 0) {
        throw new ValidationError(`${fieldName} debe ser un número mayor o igual a 0.`);
    }

    return numberValue;
};

const validateSpecies = (species: unknown): PetSpecies => {
    if (!VALID_SPECIES.includes(species as PetSpecies)) {
        throw new ValidationError(`species debe ser uno de: ${VALID_SPECIES.join(", ")}.`);
    }

    return species as PetSpecies;
};

const validateSize = (size: unknown): PetSize => {
    if (!VALID_SIZES.includes(size as PetSize)) {
        throw new ValidationError(`size debe ser uno de: ${VALID_SIZES.join(", ")}.`);
    }

    return size as PetSize;
};

const validateOptionalSex = (sex: unknown): PetSex | null | undefined => {
    if (sex === undefined) return undefined;
    if (sex === null || sex === "") return null;

    if (!VALID_SEXES.includes(sex as PetSex)) {
        throw new ValidationError(`sex debe ser uno de: ${VALID_SEXES.join(", ")}.`);
    }

    return sex as PetSex;
};

const buildCreatePetData = (userId: number, body: any): CreatePetData => {
    if (!isNonEmptyString(body.name)) {
        throw new ValidationError("El nombre de la mascota es requerido.");
    }

    return {
        user_id: userId,
        name: body.name.trim(),
        species: validateSpecies(body.species),
        breed: normalizeOptionalString(body.breed) ?? null,
        age: normalizeOptionalNumber(body.age, "age") ?? null,
        weight: normalizeOptionalNumber(body.weight, "weight") ?? null,
        size: validateSize(body.size),
        sex: validateOptionalSex(body.sex) ?? null,
        color: normalizeOptionalString(body.color) ?? null,
        allergies: normalizeOptionalString(body.allergies) ?? null,
        notes: normalizeOptionalString(body.notes) ?? null
    };
};

const buildUpdatePetData = (body: any): UpdatePetData => {
    const fields: UpdatePetData = {};

    if (body.name !== undefined) {
        if (!isNonEmptyString(body.name)) throw new ValidationError("El nombre de la mascota no puede estar vacío.");
        fields.name = body.name.trim();
    }

    if (body.species !== undefined) fields.species = validateSpecies(body.species);
    if (body.size !== undefined) fields.size = validateSize(body.size);

    if (body.breed !== undefined) fields.breed = normalizeOptionalString(body.breed) ?? null;
    if (body.age !== undefined) fields.age = normalizeOptionalNumber(body.age, "age") ?? null;
    if (body.weight !== undefined) fields.weight = normalizeOptionalNumber(body.weight, "weight") ?? null;
    if (body.sex !== undefined) fields.sex = validateOptionalSex(body.sex) ?? null;
    if (body.color !== undefined) fields.color = normalizeOptionalString(body.color) ?? null;
    if (body.allergies !== undefined) fields.allergies = normalizeOptionalString(body.allergies) ?? null;
    if (body.notes !== undefined) fields.notes = normalizeOptionalString(body.notes) ?? null;

    return fields;
};

export const getMyPets = async (userId: number, filters: { species?: string; status?: string }) => {
    let species: PetSpecies | undefined;
    let status: PetStatus | "all" | undefined;

    if (filters.species !== undefined) {
        species = validateSpecies(filters.species);
    }

    if (filters.status !== undefined) {
        if (filters.status === "all") {
            status = "all";
        } else if (VALID_STATUSES.includes(filters.status as PetStatus)) {
            status = filters.status as PetStatus;
        } else {
            throw new ValidationError(`status debe ser uno de: ${VALID_STATUSES.join(", ")} o all.`);
        }
    }

    return petsRepository.findPetsByUserId(userId, { species, status });
};

export const getMyPetById = async (userId: number, petId: number) => {
    const pet = await petsRepository.findPetByIdAndUserId(petId, userId);

    if (!pet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    return pet;
};

export const createPet = async (userId: number, body: any) => {
    const data = buildCreatePetData(userId, body);
    return petsRepository.createPet(data);
};

export const updateMyPet = async (userId: number, petId: number, body: any) => {
    const currentPet = await petsRepository.findPetByIdAndUserId(petId, userId);

    if (!currentPet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    if (currentPet.status === "inactivo") {
        throw new ValidationError("No se puede editar una mascota inactiva.");
    }

    const fields = buildUpdatePetData(body);
    const updatedPet = await petsRepository.updatePetByIdAndUserId(petId, userId, fields);

    if (!updatedPet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    return updatedPet;
};

export const deleteMyPet = async (userId: number, petId: number) => {
    const currentPet = await petsRepository.findPetByIdAndUserId(petId, userId);

    if (!currentPet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    if (currentPet.status === "inactivo") {
        return currentPet;
    }

    const deletedPet = await petsRepository.deactivatePetByIdAndUserId(petId, userId);

    if (!deletedPet) {
        throw new NotFoundError("Mascota no encontrada.");
    }

    return deletedPet;
};
