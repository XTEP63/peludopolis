import * as repo from "../repositories/payments.repository";
import { ForbiddenError, NotFoundError, ValidationError } from "../utils/errors";

const PAYMENT_METHODS = ["efectivo", "transferencia", "tarjeta"] as const;
const PAYMENT_STATUSES = ["pendiente", "pagado", "fallido", "reembolsado"] as const;

interface CreatePaymentInput {
    reservationId?: unknown;
    reservation_id?: unknown;
    paymentMethod?: unknown;
    payment_method?: unknown;
    transactionReference?: unknown;
    transaction_reference?: unknown;
}

const toPositiveInteger = (value: unknown, fieldName: string): number => {
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue <= 0) {
        throw new ValidationError(`${fieldName} debe ser un entero positivo.`);
    }

    return numberValue;
};

const normalizePaymentMethod = (value: unknown): repo.PaymentMethod => {
    if (typeof value !== "string") {
        throw new ValidationError(`paymentMethod debe ser: ${PAYMENT_METHODS.join(", ")}.`);
    }

    const method = value.trim().toLowerCase();

    if (!PAYMENT_METHODS.includes(method as repo.PaymentMethod)) {
        throw new ValidationError(`paymentMethod debe ser: ${PAYMENT_METHODS.join(", ")}.`);
    }

    return method as repo.PaymentMethod;
};

const normalizeOptionalReference = (value: unknown, reservationId: number): string => {
    if (value === undefined || value === null || value === "") {
        return `SIM-${reservationId}-${Date.now()}`;
    }

    if (typeof value !== "string" || value.trim().length > 120) {
        throw new ValidationError("transactionReference debe ser texto de máximo 120 caracteres.");
    }

    return value.trim();
};

const normalizePaymentStatusFilter = (value: unknown): repo.PaymentStatus | undefined => {
    if (value === undefined) return undefined;

    if (typeof value !== "string" || !PAYMENT_STATUSES.includes(value as repo.PaymentStatus)) {
        throw new ValidationError(`paymentStatus debe ser: ${PAYMENT_STATUSES.join(", ")}.`);
    }

    return value as repo.PaymentStatus;
};

const normalizePaymentMethodFilter = (value: unknown): repo.PaymentMethod | undefined => {
    if (value === undefined) return undefined;
    return normalizePaymentMethod(value);
};

export const createPayment = async (userId: number, input: CreatePaymentInput) => {
    const reservationId = toPositiveInteger(input.reservationId ?? input.reservation_id, "reservationId");
    const paymentMethod = normalizePaymentMethod(input.paymentMethod ?? input.payment_method);
    const transactionReference = normalizeOptionalReference(
        input.transactionReference ?? input.transaction_reference,
        reservationId
    );

    const reservation = await repo.findReservationPaymentContext(reservationId);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    if (Number(reservation.user_id) !== userId) {
        throw new ForbiddenError("No puedes pagar una reservación que no te pertenece.");
    }

    if (["cancelada", "finalizada"].includes(reservation.reservation_status)) {
        throw new ValidationError("No se puede pagar una reservación cancelada o finalizada.");
    }

    const existingPayment = await repo.findSuccessfulPaymentByReservation(reservationId);

    if (existingPayment) {
        throw new ValidationError("Esta reservación ya tiene un pago registrado como pagado.");
    }

    const amount = Number(reservation.total);

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new ValidationError("La reservación no tiene un total válido para pagar.");
    }

    return repo.createSuccessfulPayment({
        reservationId,
        amount,
        paymentMethod,
        transactionReference
    });
};

export const getMyPayments = async (userId: number) => {
    return repo.findPaymentsByUser(userId);
};

export const getPaymentsByReservationForUser = async (userId: number, reservationId: number) => {
    const reservation = await repo.findReservationPaymentContext(reservationId);

    if (!reservation) {
        throw new NotFoundError("Reservación no encontrada.");
    }

    if (Number(reservation.user_id) !== userId) {
        throw new ForbiddenError("No puedes consultar pagos de una reservación que no te pertenece.");
    }

    return repo.findPaymentsByReservationForUser(userId, reservationId);
};

export const getAllPaymentsForAdmin = async (query: {
    payment_status?: unknown;
    paymentStatus?: unknown;
    payment_method?: unknown;
    paymentMethod?: unknown;
    reservation_id?: unknown;
    reservationId?: unknown;
    user_id?: unknown;
    userId?: unknown;
}) => {
    const paymentStatus = normalizePaymentStatusFilter(query.paymentStatus ?? query.payment_status);
    const paymentMethod = normalizePaymentMethodFilter(query.paymentMethod ?? query.payment_method);
    const reservationId =
        query.reservationId !== undefined || query.reservation_id !== undefined
            ? toPositiveInteger(query.reservationId ?? query.reservation_id, "reservationId")
            : undefined;
    const userId =
        query.userId !== undefined || query.user_id !== undefined
            ? toPositiveInteger(query.userId ?? query.user_id, "userId")
            : undefined;

    return repo.findAllPayments({
        paymentStatus,
        paymentMethod,
        reservationId,
        userId
    });
};

export const getPaymentByIdForAdmin = async (paymentId: number) => {
    const payment = await repo.findPaymentById(paymentId);

    if (!payment) {
        throw new NotFoundError("Pago no encontrado.");
    }

    return payment;
};
