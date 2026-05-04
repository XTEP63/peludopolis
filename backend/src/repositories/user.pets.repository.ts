import pool from "../config/db";

// Object.keys() - regresa un arreglo con los nombres de un objeto?

export interface PetRow {
    id:         number;
    user_id:    number;
    name:       string;
    species:    string;
    breed:      string | null;
    age:        number | null;
    weight:     number | null;
    size:       "pequeno" | "mediano" | "grande";
    sex:        "macho" | "hembra" | null;
    color:      string | null;
    allergies:  string | null;
    notes:      string | null;
    status:     "activo" | "inactivo";
    created_at: Date;
    updated_at: Date;
}

/* GET - Todas las mascotas del usuario autenticado */
export const findPetsByUserId = async (userId: number): Promise<PetRow[]> => {
    const { rows } = await pool.query<PetRow>(
        `SELECT * FROM pets WHERE user_id = $1 ORDER BY id DESC`,
        [userId]
    );
    return rows;
};

/* GET - Una mascota por id */
export const findPetById = async (id: number): Promise<PetRow | null> => {
    const { rows } = await pool.query<PetRow>(
        `SELECT * FROM pets WHERE id = $1`,
        [id]
    );
    if (!rows[0]) return null;
    //hacerlo numero por que ts esta menso
    return { ...rows[0], id: Number(rows[0].id), user_id: Number(rows[0].user_id) };
};

/* POST - Crear una mascota */
export const createPet = async (
    data: Pick<PetRow, "user_id" | "name" | "species" | "size"> &
        Partial<Pick<PetRow, "breed" | "age" | "weight" | "sex" | "color" | "allergies" | "notes">>
): Promise<PetRow> => {
    const { rows } = await pool.query<PetRow>(
        `INSERT INTO pets (user_id, name, species, breed, age, weight, size, sex, color, allergies, notes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
        [
            data.user_id,
            data.name,
            data.species,
            data.breed     ?? null,
            data.age       ?? null,
            data.weight    ?? null,
            data.size,
            data.sex       ?? null,
            data.color     ?? null,
            data.allergies ?? null,
            data.notes     ?? null,
        ]
    );

    return rows[0];
};

/* PATCH - Actualizar campos de una mascota */
export const updatePetById = async (
    id:     number,
    fields: Partial<Pick<PetRow, "name" | "species" | "breed" | "age" | "weight" | "size" | "sex" | "color" | "allergies" | "notes">>
): Promise<PetRow | null> => {

    const keys = Object.keys(fields);
    if (!keys.length) return findPetById(id);

    const set = keys.map((k, idx) => `${k} = $${idx + 2}`).join(", ");

    const { rows } = await pool.query<PetRow>(
        `UPDATE pets SET ${set}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id, ...Object.values(fields)]
    );

    return rows[0] ?? null;
};

/* DELETE - Baja de una mascota [esta muy tétrico] */
export const deactivatePetById = async (id: number): Promise<Pick<PetRow, "id" | "name" | "status"> | null> => {

    const { rows } = await pool.query(
        `UPDATE pets SET status = 'inactivo', updated_at = NOW() WHERE id = $1 RETURNING id, name, status`,
        [id]
    );

    return rows[0] ?? null;
};