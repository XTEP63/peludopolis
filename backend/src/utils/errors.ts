/* Util para manejar tipos de errores, los más comúnes*/
export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/** 404 – No existe el recurso */
export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado.") {
        super(message, 404);
    }
}

/** 400 – Los datos son inválidos o hacen falta */
export class ValidationError extends AppError {
    constructor(message = "Datos inválidos.") {
        super(message, 400);
    }
}

/** 401 – Token inválido/falla de auth */
export class UnauthorizedError extends AppError {
    constructor(message = "No autenticado.") {
        super(message, 401);
    }
}

/** 403 – Permiso restringido solo a admins */
export class ForbiddenError extends AppError {
    constructor(message = "Acceso denegado.") {
        super(message, 403);
    }
}