import pool from "../config/db"

interface createUser {
    username: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string
    address?: string
}

export const findUserByEmail = async (email: string) => {
    const query =  `
    SELECT * 
    FROM users
    WHERE email = $1
    LIMIT 1
    `
    const user = await pool.query(query, [email])
    return user.rows[0] || null
}

export const createUser = async (data: createUser) => {
    const query = `
        INSERT INTO users (
            username,
            email,
            password_hash,
            first_name,
            last_name,
            phone,
            address
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            id,
            username,
            email,
            first_name,
            last_name,
            phone,
            address,
            role,
            status,
            created_at,
            updated_at
    `

    const values = [
        data.username,
        data.email,
        data.passwordHash,
        data.firstName,
        data.lastName,
        data.phone ?? null,
        data.address ?? null
    ]

    const user =  await pool.query(query, values)
    return user.rows[0]
}

export const findUserById = async (id: number) => {
    const query = `
    SELECT *
    FROM users
    WHERE id = $1
    LIMIT 1
    `

    const user = await pool.query(query, [id])
    return user.rows[0] || null
}