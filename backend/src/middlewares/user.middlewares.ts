import { Request, Response, NextFunction } from "express";

/* Helpers universales*/

const isNonEmptyString = (v: unknown): boolean =>
    typeof v === "string" && v.trim().length > 0;

const isNonNegativeNum = (v: unknown): boolean => {
    if (typeof v === "number") return v >= 0;

    if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        return !isNaN(n) && n >= 0;
    }

    return false;
};

// Solo para los validadores de req.query :(
const isIn = <T extends string>(arr: readonly T[], v: unknown): v is T =>
    typeof v === "string" && (arr as readonly string[]).includes(v);

const PET_SIZES    = ["pequeno", "mediano", "grande"] as const;
const PET_SEXES    = ["macho", "hembra"] as const;
const VALID_SPECIES = ["perro", "gato", "reptil"] as const;

// COSAS DE MASCOTAS
/* Validar el POST de mascotas */
export const validateCreatePet = (req: Request, res: Response, next: NextFunction): void => {
    const { name, species, size } = req.body;

    if (!isNonEmptyString(name)) {
        res.status(400).json({ ok: false, message: "El nombre de la mascota es requerido." });
        return;
    }

    if (!isNonEmptyString(species)) {
        res.status(400).json({ ok: false, message: "La especie es requerida." });
        return;
    }

    if (!isIn(PET_SIZES, size)) {
        res.status(400).json({ ok: false, message: `size debe ser: ${PET_SIZES.join(", ")}.` });
        return;
    }

    next();
};

/* Validar el PATCH de mascotas */
export const validatePatchPet = (req: Request, res: Response, next: NextFunction): void => {
    const { name, species, size, sex, age, weight } = req.body;

    if (name !== undefined && !isNonEmptyString(name)) {
        res.status(400).json({ ok: false, message: "El nombre no puede estar vacío." });
        return;
    }

    if (species !== undefined && !isNonEmptyString(species)) {
        res.status(400).json({ ok: false, message: "La especie no puede estar vacía." });
        return;
    }

    if (size !== undefined && !isIn(PET_SIZES, size)) {
        res.status(400).json({ ok: false, message: `size debe ser: ${PET_SIZES.join(", ")}.` });
        return;
    }

    if (sex !== undefined && !isIn(PET_SEXES, sex)) {
        res.status(400).json({ ok: false, message: `sex debe ser: ${PET_SEXES.join(", ")}.` });
        return;
    }

    if (age !== undefined && !isNonNegativeNum(age)) {
        res.status(400).json({ ok: false, message: "age debe ser un número mayor o igual a 0." });
        return;
    }

    if (weight !== undefined && !isNonNegativeNum(weight)) {
        res.status(400).json({ ok: false, message: "weight debe ser un número mayor o igual a 0." });
        return;
    }

    next();
};

/* Validar el param de ids casi siempre */
export const validateIdParam = (req: Request, res: Response, next: NextFunction): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ ok: false, message: "El parámetro :id debe ser un entero positivo." });
        return;
    }

    next();
};