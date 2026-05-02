import bcrypt from 'bcrypt'
import * as authRepository from '../repositories/auth.repository'
import { signAccessToken } from '../utils/jwt'

interface Register {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
}

interface Login {
    email: string
    password: string
}

export const registerUser = async (input: Register) => {
    if (!input.username || !input.email || !input.password || !input.firstName || !input.lastName) {
        throw new Error("Faltan campos obligatorios")
    }

    if (input.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
    }

    const email = input.email.trim().toLowerCase()
    const existingUser = await authRepository.findUserByEmail(email)

    if (existingUser) {
        throw new Error("El correo ya está registrado")
    }

    const passwordHash = await bcrypt.hash(input.password, 10)

    const user = await authRepository.createUser({
        username: input.username.trim(),
        email,
        passwordHash,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        phone: input.phone ?? null,
        address: input.address ?? null
    })

    return user
}

export const loginUser = async (input: Login) => {
    if (!input.email || !input.password) {
        throw new Error("Correo y contraseña son obligatorios")
    }

    const email = input.email.trim().toLowerCase()
    const user = await authRepository.findUserByEmail(email)

    if (!user) {
        throw new Error("Credenciales inválidas")
    }

    if (user.status !== "activo") {
        throw new Error("El usuario no está activo")
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password_hash);

    if (!isPasswordValid) {
        throw new Error("Credenciales inválidas")
    }

    const accessToken = signAccessToken({
        sub: String(user.id),
        email: user.email,
        role: user.role
    })

    return {
        accessToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            address: user.address,
            role: user.role,
            status: user.status
        }
    }
}

export const getCurrentUser = async (userId: number) => {
    const user = await authRepository.findUserById(userId)

    if (!user) {
        throw new Error("Usuario no encontrado")
    }

    return user
}