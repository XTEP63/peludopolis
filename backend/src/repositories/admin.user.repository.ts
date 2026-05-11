import pool from "../config/db"

/* COSAS DE USUARIOS */
export interface UserRow {
    id: number;
    username: string | null;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    address: string | null;
    role: "admin" | "cliente";
    status: "activo" | "inactivo" | "bloqueado";
    created_at: Date;
}

/* GET - Encontrar todos los usuarios y se puede filtrar por rol o status*/
export const findAllUsers = async (filters: {
    role?: UserRow["role"];
    status?: UserRow["status"];
}): Promise<UserRow[]> => {

    const conditions: string[] = [];
    const values: unknown[] = [];
    let i = 1;

    if (filters.role) {
        conditions.push(`role = $${i++}`);
        values.push(filters.role);
    }

    if (filters.status) {
        conditions.push(`status = $${i++}`);
        values.push(filters.status);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const { rows } = await pool.query<UserRow>(
        `SELECT id, username, email, first_name, last_name, phone, address, role, status, created_at
        FROM users
        ${where}
        ORDER BY id DESC`,
        values
    );

    return rows;
};

/* GET - Obtener un usuario por su id */
export const findUserById = async (id: number): Promise<UserRow | null> => {
    const { rows } = await pool.query<UserRow>(
        `SELECT id, username, email, first_name, last_name, phone, address, role, status, created_at
        FROM users
        WHERE id = $1`,
        [id]
    );

    return rows[0] ?? null;
};

/* PATCH - Modificiar algún campo de el usuario*/

export const updateUserById = async (
    id: number,
    fields: Partial<UserRow>
): Promise<Partial<UserRow> | null> => {

    const keys = Object.keys(fields);
    if (!keys.length) {
        const { rows } = await pool.query(
        `SELECT id, username, email, first_name, last_name, role, status
        FROM users WHERE id = $1`,
        [id]
        );
        return rows[0] ?? null;
    }

    const set = keys.map((k, idx) => `${k} = $${idx + 2}`).join(", ");

    const { rows } = await pool.query(
        `UPDATE users
        SET ${set}, updated_at = NOW()
        WHERE id = $1
        RETURNING id, username, email, first_name, last_name, role, status`,
        [id, ...Object.values(fields)]
    );

    return rows[0] ?? null;
};

/* PATCH - Modificar solo el Estatus de un usuario */
export const updateUserStatusById = async (
    id: number,
    status: UserRow["status"]
): Promise<Pick<UserRow, "id" | "username" | "status"> | null> => {

    const { rows } = await pool.query(
        `UPDATE users
        SET status = $2, updated_at = NOW()
        WHERE id = $1
        RETURNING id, username, status`,
        [id, status]
    );

    return rows[0] ?? null;
};

/* MASCOTAS DE LOS USUARIOS */

export interface PetRow {
    id: number;
    user_id: number;
    name: string;
    species: string;
    breed: string | null;
    age: number | null;
    weight: number | null;
    size: "pequeno" | "mediano" | "grande";
    sex: "macho" | "hembra" | null;
    color: string | null;
    allergies: string | null;
    notes: string | null;
    status: "activo" | "inactivo";
    created_at: Date;
}

/* GET - Obtener todas las mascotas registradas a un usuario*/
export const findPetsByUserId = async (userId: number,species?: string): Promise<PetRow[]> => {

    const values: unknown[] = [userId];
    let query = `
        SELECT *
        FROM pets
        WHERE user_id = $1`;

    if (species) {
        values.push(species);
        query += ` AND species = $${values.length}`;
    }

    query += ` ORDER BY id DESC`;

    const { rows } = await pool.query<PetRow>(query, values);

    return rows;
};