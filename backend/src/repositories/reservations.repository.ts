import pool from "../config/db";

export type ReservationStatus = "pendiente" | "confirmada" | "cancelada" | "en_curso" | "finalizada";
export type PetSpecies = "perro" | "gato" | "reptil";
export type PetSize = "pequeno" | "mediano" | "grande";

export interface RoomRow {
    id: number;
    name: string;
    pet_type_allowed: "perro" | "gato" | "reptil" | "ambos";
    size_allowed: "pequeno" | "mediano" | "grande" | "todos";
    capacity: number;
    price_per_night: number;
    description: string | null;
    image_url: string | null;
    status: "disponible" | "mantenimiento" | "inactiva" | "ocupada";
}

export interface PetRow {
    id: number;
    user_id: number;
    name: string;
    species: PetSpecies;
    breed: string | null;
    age: number | null;
    weight: number | null;
    size: PetSize;
    sex: "macho" | "hembra" | null;
    color: string | null;
    allergies: string | null;
    notes: string | null;
    status: "activo" | "inactivo";
}

export interface ServiceRow {
    id: number;
    name: string;
    description: string | null;
    price: number;
    service_type: string | null;
    status: "activo" | "inactivo";
}

export interface ReservationRow {
    id: number;
    user_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    total: number;
    reservation_status: ReservationStatus;
    notes: string | null;
    created_at: Date;
    updated_at: Date;
    room_name?: string;
}

export interface ReservationDetailRow extends ReservationRow {
    room_name: string;
    pets: unknown[];
    services: unknown[];
    payments: unknown[];
}

export interface ReservationServiceInput {
    serviceId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface CreateReservationData {
    userId: number;
    roomId: number;
    petIds: number[];
    startDate: string;
    endDate: string;
    total: number;
    notes?: string | null;
    services: ReservationServiceInput[];
}

export const findRoomById = async (roomId: number): Promise<RoomRow | null> => {
    const { rows } = await pool.query<RoomRow>(
        `SELECT * FROM rooms WHERE id = $1`,
        [roomId]
    );

    return rows[0] ?? null;
};

export const findPetsByIdsForUser = async (userId: number, petIds: number[]): Promise<PetRow[]> => {
    const { rows } = await pool.query<PetRow>(
        `SELECT *
         FROM pets
         WHERE user_id = $1
           AND id = ANY($2::bigint[])
           AND status = 'activo'
         ORDER BY id`,
        [userId, petIds]
    );

    return rows;
};

export const findServicesByIds = async (serviceIds: number[]): Promise<ServiceRow[]> => {
    if (!serviceIds.length) return [];

    const { rows } = await pool.query<ServiceRow>(
        `SELECT *
         FROM services
         WHERE id = ANY($1::bigint[])
           AND status = 'activo'
         ORDER BY id`,
        [serviceIds]
    );

    return rows;
};

export const roomHasDateConflict = async (
    roomId: number,
    startDate: string,
    endDate: string
): Promise<boolean> => {
    const { rows } = await pool.query<{ exists: boolean }>(
        `SELECT EXISTS (
            SELECT 1
            FROM reservations
            WHERE room_id = $1
              AND reservation_status IN ('pendiente', 'confirmada', 'en_curso')
              AND start_date < $3::date
              AND end_date > $2::date
         ) AS exists`,
        [roomId, startDate, endDate]
    );

    return rows[0]?.exists ?? false;
};

export const createReservation = async (data: CreateReservationData): Promise<ReservationDetailRow> => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const { rows: reservationRows } = await client.query<ReservationRow>(
            `INSERT INTO reservations (user_id, room_id, start_date, end_date, total, reservation_status, notes)
             VALUES ($1, $2, $3, $4, $5, 'pendiente', $6)
             RETURNING *`,
            [data.userId, data.roomId, data.startDate, data.endDate, data.total, data.notes ?? null]
        );

        const reservation = reservationRows[0];

        for (const petId of data.petIds) {
            await client.query(
                `INSERT INTO reservation_pets (reservation_id, pet_id)
                 VALUES ($1, $2)`,
                [reservation.id, petId]
            );
        }

        for (const service of data.services) {
            await client.query(
                `INSERT INTO reservation_services (reservation_id, service_id, quantity, unit_price, subtotal)
                 VALUES ($1, $2, $3, $4, $5)`,
                [reservation.id, service.serviceId, service.quantity, service.unitPrice, service.subtotal]
            );
        }

        await client.query("COMMIT");

        const detail = await findReservationByIdForUser(data.userId, reservation.id);
        return detail as ReservationDetailRow;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const findReservationsByUser = async (userId: number): Promise<ReservationRow[]> => {
    const { rows } = await pool.query<ReservationRow>(
        `SELECT r.*, ro.name AS room_name
         FROM reservations r
         JOIN rooms ro ON ro.id = r.room_id
         WHERE r.user_id = $1
         ORDER BY r.created_at DESC, r.id DESC`,
        [userId]
    );

    return rows;
};

export const findReservationByIdForUser = async (
    userId: number,
    reservationId: number
): Promise<ReservationDetailRow | null> => {
    const { rows } = await pool.query<ReservationRow & { room_name: string }>(
        `SELECT r.*, ro.name AS room_name
         FROM reservations r
         JOIN rooms ro ON ro.id = r.room_id
         WHERE r.id = $1
           AND r.user_id = $2`,
        [reservationId, userId]
    );

    if (!rows[0]) return null;

    const { rows: pets } = await pool.query(
        `SELECT p.*
         FROM pets p
         JOIN reservation_pets rp ON rp.pet_id = p.id
         WHERE rp.reservation_id = $1
         ORDER BY p.id`,
        [reservationId]
    );

    const { rows: services } = await pool.query(
        `SELECT rs.*, s.name AS service_name, s.description AS service_description, s.service_type
         FROM reservation_services rs
         JOIN services s ON s.id = rs.service_id
         WHERE rs.reservation_id = $1
         ORDER BY rs.id`,
        [reservationId]
    );

    const { rows: payments } = await pool.query(
        `SELECT *
         FROM payments
         WHERE reservation_id = $1
         ORDER BY created_at DESC, id DESC`,
        [reservationId]
    );

    return {
        ...rows[0],
        pets,
        services,
        payments
    };
};

export const cancelReservationByIdForUser = async (
    userId: number,
    reservationId: number
): Promise<Pick<ReservationRow, "id" | "reservation_status" | "updated_at"> | null> => {
    const { rows } = await pool.query(
        `UPDATE reservations
         SET reservation_status = 'cancelada', updated_at = NOW()
         WHERE id = $1
           AND user_id = $2
           AND reservation_status IN ('pendiente', 'confirmada')
         RETURNING id, reservation_status, updated_at`,
        [reservationId, userId]
    );

    return rows[0] ?? null;
};
