/* All custom errors extend this so the error-handler middleware */
export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/** 404 – Resource not found */
export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado.") {
        super(message, 404);
    }
}

/** 400 – Invalid or missing input data */
export class ValidationError extends AppError {
    constructor(message = "Datos inválidos.") {
        super(message, 400);
    }
}

/** 401 – Authentication required or token invalid */
export class UnauthorizedError extends AppError {
    constructor(message = "No autenticado.") {
        super(message, 401);
    }
}

/** 403 – Authenticated but not allowed */
export class ForbiddenError extends AppError {
    constructor(message = "Acceso denegado.") {
        super(message, 403);
    }
}