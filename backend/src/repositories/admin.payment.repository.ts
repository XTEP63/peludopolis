import pool from "../config/db";

export interface PaymentRow {
    id:                    number;
    reservation_id:        number;
    amount:                number;
    payment_method:        "efectivo" | "transferencia" | "tarjeta";
    payment_status:        "pendiente" | "pagado" | "fallido" | "reembolsado";
    transaction_reference: string | null;
    paid_at:               Date | null;
    created_at:            Date;

    // desde users 
    username:              string | null;
    email:                 string;
}

/* GET - Todos los pagos con filtros opcionales */
export const findAllPayments = async (filters: {
    payment_method?: PaymentRow["payment_method"];
    payment_status?: PaymentRow["payment_status"];
}): Promise<PaymentRow[]> => {

    const conditions: string[] = [];
    const values: unknown[]    = [];
    let   i = 1;

    if (filters.payment_method) { 
        conditions.push(`p.payment_method = $${i++}`); 
        values.push(filters.payment_method); 
    }

    if (filters.payment_status) { 
        conditions.push(`p.payment_status = $${i++}`); 
        values.push(filters.payment_status); 
    }
    
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query<PaymentRow>(
        `SELECT p.*, u.username, u.email
        FROM payments p
        JOIN reservations r ON p.reservation_id = r.id
        JOIN users u        ON r.user_id = u.id
        ${where} ORDER BY p.id DESC`,
        values
    );

    return rows;
};