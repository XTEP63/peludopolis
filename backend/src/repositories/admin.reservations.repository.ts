import pool from "../config/db";

/* Contrato de Val de Reservaciones*/
export interface ReservationRow {
    id:                 number;
    user_id:            number;
    room_id:            number;
    start_date:         string;
    end_date:           string;
    total:              number;
    reservation_status: "pendiente" | "confirmada" | "cancelada" | "en_curso" | "finalizada";
    notes:              string | null;
    created_at:         Date;
    updated_at:         Date;

     // joined desde users
    username:           string | null;
    email:              string;
    first_name:         string;
    last_name:          string;

    // joined desde rooms
    room_name:          string;
}

export interface ReservationDetailRow extends ReservationRow {
    pets:     unknown[];
    services: unknown[];
    payments: unknown[];
}

/* GET - Todas las reservaciones con filtros opcionales */
export const findAllReservations = async (filters: {
    date?:   string;
    user?:   string;
    status?: ReservationRow["reservation_status"];
}): Promise<ReservationRow[]> => {

    const conditions: string[] = [];
    const values: unknown[]    = [];
    let   i = 1;

    if (filters.status) { 
        conditions.push(`r.reservation_status = $${i++}`);                        
        values.push(filters.status); 
    }

    if (filters.user)   { 
        conditions.push(`(u.username ILIKE $${i} OR u.email ILIKE $${i++})`);     
        values.push(`%${filters.user}%`); 
    }

    if (filters.date)   { 
        conditions.push(`(r.start_date <= $${i} AND r.end_date >= $${i++})`);     
        values.push(filters.date); 
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query<ReservationRow>(
        `SELECT r.*, u.username, u.email, u.first_name, u.last_name, ro.name AS room_name
        FROM reservations r
        JOIN users u  ON r.user_id = u.id
        JOIN rooms ro ON r.room_id = ro.id
        ${where} ORDER BY r.id DESC`,
        values
    );
    return rows;
};

/* GET - Una reservación por id con pets, services y payments */
export const findReservationById = async (id: number): Promise<ReservationDetailRow | null> => {
    const { rows } = await pool.query<ReservationRow>(
        `SELECT r.*, u.username, u.email, u.first_name, u.last_name, ro.name AS room_name
        FROM reservations r
        JOIN users u  ON r.user_id = u.id
        JOIN rooms ro ON r.room_id = ro.id
        WHERE r.id = $1`,
        [id]
    );

    // Regresa un arreglo si el primero esta vacío que no siga
    if (!rows[0]) return null;

    const { rows: pets }     = await pool.query(`SELECT p.* FROM pets p JOIN reservation_pets rp ON rp.pet_id = p.id WHERE rp.reservation_id = $1`, [id]);
    const { rows: services } = await pool.query(`SELECT rs.*, s.name AS service_name FROM reservation_services rs JOIN services s ON s.id = rs.service_id WHERE rs.reservation_id = $1`, [id]);
    const { rows: payments } = await pool.query(`SELECT * FROM payments WHERE reservation_id = $1`, [id]);
    
    // Combina todo en un solo objeto:
    // rows[0]  = todos los campos de la reservación (con usuario y habitación)
    // pets        = arreglo de mascotas
    // services    = arreglo de servicios con precios
    // payments    = arreglo de pagos
    return { ...rows[0], pets, services, payments };
};

/* PATCH - Cambiar el status de una reservación */
export const updateReservationStatusById = async (
    id:                 number,
    reservation_status: ReservationRow["reservation_status"]): 
    Promise<Pick<ReservationRow, "id" | "reservation_status"> | null> => {

    const { rows } = await pool.query(
        `UPDATE reservations SET reservation_status = $2, updated_at = NOW()
        WHERE id = $1 RETURNING id, reservation_status`,
        [id, reservation_status]
    );
    return rows[0] ?? null;
};

/* PATCH - Confirmar check-in*/
export const confirmCheckIn = async (reservationId: number): Promise<unknown> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Registra el movimiento de check_in en el historial
        const { rows } = await client.query(
            `INSERT INTO check_movements (reservation_id, movement_type, movement_status, confirmed_at)
             VALUES ($1, 'check_in', 'confirmado', NOW()) RETURNING *`,
            [reservationId]
        );

        // Cambia el status
        await client.query(
            `UPDATE reservations SET reservation_status = 'en_curso', updated_at = NOW() WHERE id = $1`,
            [reservationId]
        );

        // Si las dos queries llegaron aquí sin error, confirma ambos cambios juntos
        await client.query("COMMIT");
        return rows[0];
    } catch (e) {

        // Si alguna falla, hace rollback y es como si no se hubiese ejecutado nadota
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
};

/* PATCH - Confirmar check-out */
export const confirmCheckOut = async (reservationId: number): Promise<unknown> => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `INSERT INTO check_movements (reservation_id, movement_type, movement_status, confirmed_at)
             VALUES ($1, 'check_out', 'confirmado', NOW()) RETURNING *`,
            [reservationId]
        );
        await client.query(
            `UPDATE reservations SET reservation_status = 'finalizada', updated_at = NOW() WHERE id = $1`,
            [reservationId]
        );
        await client.query("COMMIT");
        return rows[0];
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
};