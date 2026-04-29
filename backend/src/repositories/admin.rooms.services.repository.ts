import pool from "../config/db";

// RETURNING * - Cosa de Postgre para una vez se creo el objeto lo regrese

/* COSAS DE HABITACIONES */
// Verificaciones de datos y validaciones
export interface RoomRow {
    id:               number;
    name:             string;
    pet_type_allowed: "perro" | "gato" | "reptil" | "ambos";
    size_allowed:     "pequeno" | "mediano" | "grande" | "todos";
    capacity:         number;
    price_per_night:  number;
    description:      string | null;
    image_url:        string | null;
    status:           "disponible" | "mantenimiento" | "inactiva" | "ocupada";
    created_at:       Date;
    updated_at:       Date;
}

/* GET - Todas las habitaciones (CON FILTROS OP)*/
export const findAllRooms = async (filters: {
    status?:           RoomRow["status"];
    pet_type_allowed?: RoomRow["pet_type_allowed"];
    size_allowed?:     RoomRow["size_allowed"];
}): Promise<RoomRow[]> => {

    const conditions: string[] = [];
    const values: unknown[]    = [];
    let   i = 1;

    if (filters.status)           { conditions.push(`status = $${i++}`);           values.push(filters.status); }
    if (filters.pet_type_allowed) { conditions.push(`pet_type_allowed = $${i++}`); values.push(filters.pet_type_allowed); }
    if (filters.size_allowed)     { conditions.push(`size_allowed = $${i++}`);     values.push(filters.size_allowed); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query<RoomRow>(
        `SELECT * FROM rooms ${where} ORDER BY id DESC`,
        values
    );
    return rows;
};

/* GET - Una habitación por id */
export const findRoomById = async (id: number): Promise<RoomRow | null> => {
    const { rows } = await pool.query<RoomRow>(
        `SELECT * FROM rooms WHERE id = $1`,
        [id]
    );
    return rows[0] ?? null;
};

/* POST - Crear una habitación */
export const createRoom = async (
    /* separamos obl de los op */
    data: Pick<RoomRow, "name" | "pet_type_allowed" | "size_allowed" | "capacity" | "price_per_night"> & {description?: string | null; image_url?:   string | null;}
): Promise<RoomRow> => {
    const { rows } = await pool.query<RoomRow>(
        `INSERT INTO rooms (name, pet_type_allowed, size_allowed, capacity, price_per_night, description, image_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [
            data.name,
            data.pet_type_allowed,
            data.size_allowed,
            data.capacity,
            data.price_per_night,
            data.description ?? null,
            data.image_url   ?? null,
        ]
    );
    return rows[0];
};

/* PATCH - Actualizar campos de una habitación */
export const updateRoomById = async (
    id:     number,
    fields: Partial<Pick<RoomRow, "name" | "pet_type_allowed" | "size_allowed" | "capacity" | "price_per_night" | "description" | "image_url">>): Promise<RoomRow | null> => {
    const keys = Object.keys(fields);
    if (!keys.length) return findRoomById(id);

    const set = keys.map((k, idx) => `${k} = $${idx + 2}`).join(", ");

    const { rows } = await pool.query<RoomRow>(
        `UPDATE rooms SET ${set}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...Object.values(fields)]
    );
    return rows[0] ?? null;
};

/* DELETE - Eliminar una habitación */
export const deleteRoomById = async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
        `DELETE FROM rooms WHERE id = $1`,
        [id]
    );
    return (rowCount ?? 0) > 0;
};

/* PATCH - Cambiar solo el status de una habitación */
export const updateRoomStatusById = async (
    id:     number,
    status: RoomRow["status"]): Promise<Pick<RoomRow, "id" | "name" | "status"> | null> => {
    const { rows } = await pool.query(
        `UPDATE rooms SET status = $2, updated_at = NOW() WHERE id = $1
        RETURNING id, name, status`,
        [id, status]
    );
    return rows[0] ?? null;
};

/* COSAS DE LOS SERVICIOS */

export interface ServiceRow {
    id:           number;
    name:         string;
    description:  string | null;
    price:        number;
    service_type: string | null;
    status:       "activo" | "inactivo";
    created_at:   Date;
    updated_at:   Date;
}

/* GET - Todos los servicios (FILTROS OP) */
export const findAllServices = async (filters: {status?: ServiceRow["status"]; service_type?: string;}): Promise<ServiceRow[]> => {

    const conditions: string[] = [];
    const values: unknown[]    = [];
    let   i = 1;

    if (filters.status)       { conditions.push(`status = $${i++}`);       values.push(filters.status); }
    if (filters.service_type) { conditions.push(`service_type = $${i++}`); values.push(filters.service_type); }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query<ServiceRow>(
        `SELECT * FROM services ${where} ORDER BY id DESC`,
        values);

    return rows;
};

/* GET - Buscar un servicio por id */
export const findServiceById = async (id: number): Promise<ServiceRow | null> => {
    const { rows } = await pool.query<ServiceRow>(
        `SELECT * FROM services WHERE id = $1`,
        [id]);

    return rows[0] ?? null;
};

/* POST - Crear un servicio */
export const createService = async (
    data: Pick<ServiceRow, "name" | "price"> & {
        description?:  string | null;
        service_type?: string | null;
    }
): Promise<ServiceRow> => {
    const { rows } = await pool.query<ServiceRow>(
        `INSERT INTO services (name, description, price, service_type)
         VALUES ($1,$2,$3,$4) RETURNING *`,
        [data.name, data.description ?? null, data.price, data.service_type ?? null]);

    return rows[0];
};

/* PATCH - Actualizar campos de un servicio */
export const updateServiceById = async (
    id:     number,
    fields: Partial<Pick<ServiceRow, "name" | "description" | "price" | "service_type" | "status">>): Promise<ServiceRow | null> => {
    const keys = Object.keys(fields);
    if (!keys.length) return findServiceById(id);

    const set = keys.map((k, idx) => `${k} = $${idx + 2}`).join(", ");

    const { rows } = await pool.query<ServiceRow>(
        `UPDATE services SET ${set}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...Object.values(fields)]);

    return rows[0] ?? null;
};

/* DELETE - Eliminar un servicio por su ID*/
export const deleteServiceById = async (id: number): Promise<boolean> => {
    const { rowCount } = await pool.query(
        `DELETE FROM services WHERE id = $1`,
        [id]);

    return (rowCount ?? 0) > 0;
};