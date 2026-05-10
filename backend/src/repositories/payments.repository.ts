import pool from "../config/db";

export type PaymentMethod = "efectivo" | "transferencia" | "tarjeta";
export type PaymentStatus = "pendiente" | "pagado" | "fallido" | "reembolsado";
export type ReservationStatus = "pendiente" | "confirmada" | "cancelada" | "en_curso" | "finalizada";

export interface PaymentRow {
    id: number;
    reservation_id: number;
    amount: string | number;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    transaction_reference: string | null;
    paid_at: Date | null;
    created_at: Date;
}

export interface ReservationPaymentContextRow {
    id: number;
    user_id: number;
    total: string | number;
    reservation_status: ReservationStatus;
    start_date: Date | string;
    end_date: Date | string;
    room_name: string;
}

export interface PaymentWithReservationRow extends PaymentRow {
    reservation_status: ReservationStatus;
    reservation_total: string | number;
    start_date: Date | string;
    end_date: Date | string;
    user_id: number;
    user_email: string;
    username: string | null;
    room_id: number;
    room_name: string;
}

export const findReservationPaymentContext = async (
    reservationId: number
): Promise<ReservationPaymentContextRow | null> => {
    const { rows } = await pool.query<ReservationPaymentContextRow>(
        `SELECT r.id,
                r.user_id,
                r.total,
                r.reservation_status,
                r.start_date,
                r.end_date,
                ro.name AS room_name
         FROM reservations r
         JOIN rooms ro ON ro.id = r.room_id
         WHERE r.id = $1
         LIMIT 1`,
        [reservationId]
    );

    return rows[0] ?? null;
};

export const findSuccessfulPaymentByReservation = async (
    reservationId: number
): Promise<PaymentRow | null> => {
    const { rows } = await pool.query<PaymentRow>(
        `SELECT *
         FROM payments
         WHERE reservation_id = $1
           AND payment_status = 'pagado'
         ORDER BY created_at DESC, id DESC
         LIMIT 1`,
        [reservationId]
    );

    return rows[0] ?? null;
};

export const createSuccessfulPayment = async (data: {
    reservationId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionReference: string;
}): Promise<PaymentRow> => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { rows } = await client.query<PaymentRow>(
            `INSERT INTO payments (
                reservation_id,
                amount,
                payment_method,
                payment_status,
                transaction_reference,
                paid_at
             )
             VALUES ($1, $2, $3, 'pagado', $4, NOW())
             RETURNING *`,
            [
                data.reservationId,
                data.amount,
                data.paymentMethod,
                data.transactionReference
            ]
        );

        await client.query(
            `UPDATE reservations
             SET reservation_status = 'confirmada',
                 updated_at = NOW()
             WHERE id = $1
               AND reservation_status = 'pendiente'`,
            [data.reservationId]
        );

        await client.query("COMMIT");
        return rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const findPaymentsByReservationForUser = async (
    userId: number,
    reservationId: number
): Promise<PaymentRow[]> => {
    const { rows } = await pool.query<PaymentRow>(
        `SELECT p.*
         FROM payments p
         JOIN reservations r ON r.id = p.reservation_id
         WHERE p.reservation_id = $1
           AND r.user_id = $2
         ORDER BY p.created_at DESC, p.id DESC`,
        [reservationId, userId]
    );

    return rows;
};

export const findPaymentsByUser = async (userId: number): Promise<PaymentWithReservationRow[]> => {
    const { rows } = await pool.query<PaymentWithReservationRow>(
        `SELECT p.*,
                r.reservation_status,
                r.total AS reservation_total,
                r.start_date,
                r.end_date,
                r.user_id,
                u.email AS user_email,
                u.username,
                ro.id AS room_id,
                ro.name AS room_name
         FROM payments p
         JOIN reservations r ON r.id = p.reservation_id
         JOIN users u ON u.id = r.user_id
         JOIN rooms ro ON ro.id = r.room_id
         WHERE r.user_id = $1
         ORDER BY p.created_at DESC, p.id DESC`,
        [userId]
    );

    return rows;
};

export const findAllPayments = async (filters: {
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    reservationId?: number;
    userId?: number;
}): Promise<PaymentWithReservationRow[]> => {
    const conditions: string[] = [];
    const values: unknown[] = [];
    let index = 1;

    if (filters.paymentStatus) {
        conditions.push(`p.payment_status = $${index++}`);
        values.push(filters.paymentStatus);
    }

    if (filters.paymentMethod) {
        conditions.push(`p.payment_method = $${index++}`);
        values.push(filters.paymentMethod);
    }

    if (filters.reservationId) {
        conditions.push(`p.reservation_id = $${index++}`);
        values.push(filters.reservationId);
    }

    if (filters.userId) {
        conditions.push(`r.user_id = $${index++}`);
        values.push(filters.userId);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query<PaymentWithReservationRow>(
        `SELECT p.*,
                r.reservation_status,
                r.total AS reservation_total,
                r.start_date,
                r.end_date,
                r.user_id,
                u.email AS user_email,
                u.username,
                ro.id AS room_id,
                ro.name AS room_name
         FROM payments p
         JOIN reservations r ON r.id = p.reservation_id
         JOIN users u ON u.id = r.user_id
         JOIN rooms ro ON ro.id = r.room_id
         ${where}
         ORDER BY p.created_at DESC, p.id DESC`,
        values
    );

    return rows;
};

export const findPaymentById = async (paymentId: number): Promise<PaymentWithReservationRow | null> => {
    const { rows } = await pool.query<PaymentWithReservationRow>(
        `SELECT p.*,
                r.reservation_status,
                r.total AS reservation_total,
                r.start_date,
                r.end_date,
                r.user_id,
                u.email AS user_email,
                u.username,
                ro.id AS room_id,
                ro.name AS room_name
         FROM payments p
         JOIN reservations r ON r.id = p.reservation_id
         JOIN users u ON u.id = r.user_id
         JOIN rooms ro ON ro.id = r.room_id
         WHERE p.id = $1
         LIMIT 1`,
        [paymentId]
    );

    return rows[0] ?? null;
};
