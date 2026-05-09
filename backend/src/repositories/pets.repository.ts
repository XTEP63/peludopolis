import pool from "../config/db";

export type PetSpecies = "perro" | "gato" | "reptil";
export type PetSize = "pequeno" | "mediano" | "grande";
export type PetSex = "macho" | "hembra";
export type PetStatus = "activo" | "inactivo";

export interface PetRow {
    id: number;
    user_id: number;
    name: string;
    species: PetSpecies;
    breed: string | null;
    age: number | null;
    weight: number | null;
    size: PetSize;
    sex: PetSex | null;
    color: string | null;
    allergies: string | null;
    notes: string | null;
    status: PetStatus;
    created_at: Date;
    updated_at: Date;
}

export interface CreatePetData {
    user_id: number;
    name: string;
    species: PetSpecies;
    breed?: string | null;
    age?: number | null;
    weight?: number | null;
    size: PetSize;
    sex?: PetSex | null;
    color?: string | null;
    allergies?: string | null;
    notes?: string | null;
}

export type UpdatePetData = Partial<Pick<PetRow,
    "name" | "species" | "breed" | "age" | "weight" | "size" | "sex" | "color" | "allergies" | "notes"
>>;

export const findPetsByUserId = async (
    userId: number,
    filters: { species?: PetSpecies; status?: PetStatus | "all" } = {}
): Promise<PetRow[]> => {
    const conditions: string[] = ["user_id = $1"];
    const values: unknown[] = [userId];
    let i = 2;

    if (filters.species) {
        conditions.push(`species = $${i++}`);
        values.push(filters.species);
    }

    if (!filters.status) {
        conditions.push("status = 'activo'");
    } else if (filters.status !== "all") {
        conditions.push(`status = $${i++}`);
        values.push(filters.status);
    }

    const { rows } = await pool.query<PetRow>(
        `SELECT * FROM pets WHERE ${conditions.join(" AND ")} ORDER BY id DESC`,
        values
    );

    return rows;
};

export const findPetByIdAndUserId = async (id: number, userId: number): Promise<PetRow | null> => {
    const { rows } = await pool.query<PetRow>(
        `SELECT * FROM pets WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );

    return rows[0] ?? null;
};

export const createPet = async (data: CreatePetData): Promise<PetRow> => {
    const { rows } = await pool.query<PetRow>(
        `INSERT INTO pets (
            user_id, name, species, breed, age, weight, size, sex, color, allergies, notes
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *`,
        [
            data.user_id,
            data.name,
            data.species,
            data.breed ?? null,
            data.age ?? null,
            data.weight ?? null,
            data.size,
            data.sex ?? null,
            data.color ?? null,
            data.allergies ?? null,
            data.notes ?? null
        ]
    );

    return rows[0];
};

export const updatePetByIdAndUserId = async (
    id: number,
    userId: number,
    fields: UpdatePetData
): Promise<PetRow | null> => {
    const keys = Object.keys(fields) as Array<keyof UpdatePetData>;

    if (!keys.length) {
        return findPetByIdAndUserId(id, userId);
    }

    const set = keys.map((key, index) => `${String(key)} = $${index + 3}`).join(", ");
    const values = keys.map((key) => fields[key]);

    const { rows } = await pool.query<PetRow>(
        `UPDATE pets
         SET ${set}, updated_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [id, userId, ...values]
    );

    return rows[0] ?? null;
};

export const deactivatePetByIdAndUserId = async (id: number, userId: number): Promise<PetRow | null> => {
    const { rows } = await pool.query<PetRow>(
        `UPDATE pets
         SET status = 'inactivo', updated_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING *`,
        [id, userId]
    );

    return rows[0] ?? null;
};
