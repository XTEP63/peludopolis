import pool from "../config/db";

export interface PublicServiceRow {
    id: number;
    name: string;
    description: string | null;
    price: number;
    service_type: string | null;
    status: "activo" | "inactivo";
    created_at: Date;
    updated_at: Date;
}

export const findActiveServices = async (filters: { service_type?: string } = {}): Promise<PublicServiceRow[]> => {
    const values: unknown[] = [];
    let where = "WHERE status = 'activo'";

    if (filters.service_type) {
        values.push(filters.service_type);
        where += ` AND service_type = $${values.length}`;
    }

    const { rows } = await pool.query<PublicServiceRow>(
        `SELECT * FROM services ${where} ORDER BY name ASC`,
        values
    );

    return rows;
};

export const findActiveServiceById = async (id: number): Promise<PublicServiceRow | null> => {
    const { rows } = await pool.query<PublicServiceRow>(
        `SELECT * FROM services WHERE id = $1 AND status = 'activo'`,
        [id]
    );

    return rows[0] ?? null;
};
