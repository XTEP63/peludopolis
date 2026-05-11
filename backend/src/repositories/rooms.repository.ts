import pool from "../config/db";

export type RoomStatus = "disponible" | "mantenimiento" | "inactiva" | "ocupada";
export type PetTypeAllowed = "perro" | "gato" | "reptil" | "ambos";
export type RoomSizeAllowed = "pequeno" | "mediano" | "grande" | "todos";

export interface RoomRow {
    id: number;
    name: string;
    pet_type_allowed: PetTypeAllowed;
    size_allowed: RoomSizeAllowed;
    capacity: number;
    price_per_night: number;
    description: string | null;
    image_url: string | null;
    status: RoomStatus;
    created_at: Date;
    updated_at: Date;
}

export interface PublicRoomFilters {
    pet_type_allowed?: PetTypeAllowed;
    size_allowed?: RoomSizeAllowed;
    max_price?: number;
    start_date?: string;
    end_date?: string;
}

export const findAvailableRooms = async (filters: PublicRoomFilters): Promise<RoomRow[]> => {
    const conditions: string[] = ["r.status = 'disponible'"];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (filters.pet_type_allowed) {
        conditions.push(`r.pet_type_allowed IN ($${paramIndex++}, 'ambos')`);
        values.push(filters.pet_type_allowed);
    }

    if (filters.size_allowed) {
        conditions.push(`r.size_allowed IN ($${paramIndex++}, 'todos')`);
        values.push(filters.size_allowed);
    }

    if (filters.max_price !== undefined) {
        conditions.push(`r.price_per_night <= $${paramIndex++}`);
        values.push(filters.max_price);
    }

    if (filters.start_date && filters.end_date) {
        conditions.push(`
            NOT EXISTS (
                SELECT 1
                FROM reservations res
                WHERE res.room_id = r.id
                  AND res.reservation_status IN ('pendiente', 'confirmada', 'en_curso')
                  AND res.start_date < $${paramIndex + 1}
                  AND res.end_date > $${paramIndex}
            )
        `);
        values.push(filters.start_date, filters.end_date);
        paramIndex += 2;
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query<RoomRow>(
        `SELECT r.*
         FROM rooms r
         ${where}
         ORDER BY r.price_per_night ASC, r.id ASC`,
        values
    );

    return rows;
};

export const findAvailableRoomById = async (id: number): Promise<RoomRow | null> => {
    const { rows } = await pool.query<RoomRow>(
        `SELECT *
         FROM rooms
         WHERE id = $1
           AND status = 'disponible'`,
        [id]
    );

    return rows[0] ?? null;
};
