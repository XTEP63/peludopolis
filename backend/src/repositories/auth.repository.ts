import pool from "../config/db"

interface createUser {
    username: string
    email: string
    passwordHash: string
    firstName: string
    lastName: string
    phone?: string | null
    address?: string | null
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

export const updateUserById = async (id: number, updateData: any) => {
    const fields = []
    const values = []
    let paramIndex = 1

    if (updateData.username) {
        fields.push(`username = $${paramIndex}`)
        values.push(updateData.username)
        paramIndex++
    }
    if (updateData.email) {
        fields.push(`email = $${paramIndex}`)
        values.push(updateData.email)
        paramIndex++
    }
    if (updateData.firstName !== undefined) {
        fields.push(`first_name = $${paramIndex}`)
        values.push(updateData.firstName)
        paramIndex++
    }
    if (updateData.lastName !== undefined) {
        fields.push(`last_name = $${paramIndex}`)
        values.push(updateData.lastName)
        paramIndex++
    }
    if (updateData.phone !== undefined) {
        fields.push(`phone = $${paramIndex}`)
        values.push(updateData.phone)
        paramIndex++
    }
    if (updateData.address !== undefined) {
        fields.push(`address = $${paramIndex}`)
        values.push(updateData.address)
        paramIndex++
    }

    if (fields.length === 0) {
        throw new Error("No fields to update")
    }

    fields.push(`updated_at = NOW()`)

    const query = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING *
    `

    values.push(id)

    const result = await pool.query(query, values)
    return result.rows[0]
}