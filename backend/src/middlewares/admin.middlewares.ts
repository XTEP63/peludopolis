import { Request, Response, NextFunction } from "express";

/* Middleware para validar tamaños y valores de los datos mediante los requests, mas que nada en el service */

/* Helpers universales*/

const isNonEmptyString = (v: unknown): boolean =>
    typeof v === "string" && v.trim().length > 0;

const isPositiveNumber = (v: unknown): boolean => {
    if (typeof v === "number") return v > 0;

    if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        return !isNaN(n) && n > 0;
    }

    return false;
};

const isNonNegativeNumber = (v: unknown): boolean => {
    if (typeof v === "number") return v >= 0;

    if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        return !isNaN(n) && n >= 0;
    }

    return false;
};

const isValidEmail = (v: unknown): boolean =>
    typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Solo para los validadores de req.query :(
const isIn = <T extends string>(arr: readonly T[], v: unknown): v is T =>
    typeof v === "string" && (arr as readonly string[]).includes(v);

/* Listas para los valores restringidos de las tablas */

const USER_ROLES    = ["admin", "cliente"] as const;
const USER_STATUSES = ["activo", "inactivo", "bloqueado"] as const;
const PET_TYPES     = ["perro", "gato", "reptil", "ambos"] as const;
const ROOM_SIZES    = ["pequeno", "mediano", "grande", "todos"] as const;
const ROOM_STATUSES = ["disponible", "mantenimiento", "inactiva", "ocupada"] as const;
const RES_STATUSES  = ["pendiente", "confirmada", "cancelada", "en_curso", "finalizada"] as const;

/* Validación de los Usuarios*/

/* Validar filtros de los GET */
export const validateUserFilters = (req: Request, res: Response, next: NextFunction) => {
    const { role, status } = req.query;

    if (role !== undefined) {
        if (typeof role !== "string" || !isIn(USER_ROLES, role)) {
            return res.status(400).json({ok: false, message: `role debe ser uno de: ${USER_ROLES.join(", ")}`});
        }
    }

    if (status !== undefined) {
        if (typeof status !== "string" || !isIn(USER_STATUSES, status)) {
            return res.status(400).json({ok: false, message: `status debe ser uno de: ${USER_STATUSES.join(", ")}`});
        }
    }

    next();
};
/* Validación del PATCH de admin a un usuario */

export const validatePatchUser = (req: Request, res: Response, next: NextFunction) => {
    const { email, role, first_name, last_name } = req.body;

    if (email !== undefined && !isValidEmail(email))
        return res.status(400).json({ ok: false, message: "El email no tiene un formato válido." });

    if (role !== undefined && !USER_ROLES.includes(role))
        return res.status(400).json({ ok: false, message: `El rol debe ser uno de: ${USER_ROLES.join(", ")}.` });

    if (first_name !== undefined && !isNonEmptyString(first_name))
        return res.status(400).json({ ok: false, message: "first_name no puede estar vacío." });

    if (last_name !== undefined && !isNonEmptyString(last_name))
        return res.status(400).json({ ok: false, message: "last_name no puede estar vacío." });

    next();
};

/* Validar el estatus del usuario cuando se modifica como admin */
export const validateUserStatus = (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;

    if (!status)
        return res.status(400).json({ ok: false, message: "El campo 'status' es requerido." });

    if (!USER_STATUSES.includes(status))
        return res.status(400).json({ ok: false, message: `status debe ser uno de: ${USER_STATUSES.join(", ")}.` });

    next();
};

/* Validar que la especie del animal si sea correcta */
const VALID_SPECIES = ["perro", "gato", "reptil"];

export const validatePetsFilters = (req: Request, res: Response, next: NextFunction) => {

    const { species } = req.query;

    if (species && typeof species === "string") {
        if (!VALID_SPECIES.includes(species)) {
            return res.status(400).json({
                ok: false,
                message: `species debe ser: ${VALID_SPECIES.join(", ")}`
            });
        }
    }

    next();
};

/* Validación de las habitaciones */

/* Validar los params filtros del GET*/
export const validateRoomFilters = (req: Request, res: Response, next: NextFunction) => {
    const { status, pet_type_allowed, size_allowed } = req.query;

    if (status !== undefined && !isIn(ROOM_STATUSES, status)) {
        return res.status(400).json({ ok: false, message: `status debe ser: ${ROOM_STATUSES.join(", ")}.` });
        
    }

    if (pet_type_allowed !== undefined && !isIn(PET_TYPES, pet_type_allowed)) {
        return res.status(400).json({ ok: false, message: `pet_type_allowed debe ser: ${PET_TYPES.join(", ")}.` });
        
    }

    if (size_allowed !== undefined && !isIn(ROOM_SIZES, size_allowed)) {
        return res.status(400).json({ ok: false, message: `size_allowed debe ser: ${ROOM_SIZES.join(", ")}.` });
        
    }

    next();
};

/* Validar los campos cuando creamos un una nueba hab como admin */
export const validateCreateRoom = (req: Request, res: Response, next: NextFunction) => {
    const { name, pet_type_allowed, size_allowed, capacity, price_per_night } = req.body;

    if (!isNonEmptyString(name))
        return res.status(400).json({ ok: false, message: "El nombre de la habitación es requerido." });

    if (!PET_TYPES.includes(pet_type_allowed))
        return res.status(400).json({ ok: false, message: `pet_type_allowed debe ser: ${PET_TYPES.join(", ")}.` });

    if (!ROOM_SIZES.includes(size_allowed))
        return res.status(400).json({ ok: false, message: `size_allowed debe ser: ${ROOM_SIZES.join(", ")}.` });

    if (!isPositiveNumber(capacity))
        return res.status(400).json({ ok: false, message: "capacity debe ser un número entero mayor a 0." });

    if (!isNonNegativeNumber(price_per_night))
        return res.status(400).json({ ok: false, message: "price_per_night debe ser un número >= 0." });

    next();
};

/* Validar cuando solo hacemos una modificación a esta*/
/* Campos op*/
export const validatePatchRoom = (req: Request, res: Response, next: NextFunction) => {
    const { name, pet_type_allowed, size_allowed, capacity, price_per_night } = req.body;

    if (name !== undefined && !isNonEmptyString(name))
        return res.status(400).json({ ok: false, message: "El nombre no puede estar vacío." });

    if (pet_type_allowed !== undefined && !PET_TYPES.includes(pet_type_allowed))
        return res.status(400).json({ ok: false, message: `pet_type_allowed debe ser: ${PET_TYPES.join(", ")}.` });

    if (size_allowed !== undefined && !ROOM_SIZES.includes(size_allowed))
        return res.status(400).json({ ok: false, message: `size_allowed debe ser: ${ROOM_SIZES.join(", ")}.` });

    if (capacity !== undefined && !isPositiveNumber(capacity))
        return res.status(400).json({ ok: false, message: "capacity debe ser un número entero mayor a 0." });

    if (price_per_night !== undefined && !isNonNegativeNumber(price_per_night))
        return res.status(400).json({ ok: false, message: "price_per_night debe ser un número >= 0." });

    next();
};

/* Validar el cambio de estatus como admin*/
export const validateRoomStatus = (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;

    if (!status)
        return res.status(400).json({ ok: false, message: "El campo 'status' es requerido." });

    if (!ROOM_STATUSES.includes(status))
        return res.status(400).json({ ok: false, message: `status debe ser: ${ROOM_STATUSES.join(", ")}.` });

    next();
};

/* Validadores de los Servicios */

/* Validar la búsqueda de servicio con sus filtros op */
export const validateServiceFilters = (req: Request, res: Response, next: NextFunction): void => {
    const { status } = req.query;

    if (status !== undefined && !["activo", "inactivo"].includes(status as string)) {
        res.status(400).json({ ok: false, message: "status debe ser: activo, inactivo." });
        return;
    }

    next();
};

/* Validar todos los campos de cuando se crea un nuevo servicio */
export const validateCreateService = (req: Request, res: Response, next: NextFunction) => {
    const { name, price } = req.body;

    if (!isNonEmptyString(name))
        return res.status(400).json({ ok: false, message: "El nombre del servicio es requerido." });

    if (!isNonNegativeNumber(price))
        return res.status(400).json({ ok: false, message: "price debe ser un número >= 0." });

    next();
};

/* Validar solo cuando hacemos una modificación */
export const validatePatchService = (req: Request, res: Response, next: NextFunction) => {
    const { name, price, status } = req.body;

    if (name !== undefined && !isNonEmptyString(name))
        return res.status(400).json({ ok: false, message: "El nombre no puede estar vacío." });

    if (price !== undefined && !isNonNegativeNumber(price))
        return res.status(400).json({ ok: false, message: "price debe ser un número >= 0." });

    if (status !== undefined && !["activo", "inactivo"].includes(status))
        return res.status(400).json({ ok: false, message: "status debe ser: activo, inactivo." });

    next();
};

/* Validar una reservación */
/*Validar cuando se hace un cambio en el estado de la reservación */
export const validateReservationStatus = (req: Request, res: Response, next: NextFunction) => {
    const { reservation_status } = req.body;

    if (!reservation_status)
        return res.status(400).json({ ok: false, message: "El campo 'reservation_status' es requerido." });

    if (!RES_STATUSES.includes(reservation_status))
        return res.status(400).json({ ok: false, message: `reservation_status debe ser: ${RES_STATUSES.join(", ")}.` });

    next();
};

/* Validar los params de busqueda de los gets en general */
export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0)
        return res.status(400).json({ ok: false, message: "El parámetro :id debe ser un entero positivo." });

    next();
};