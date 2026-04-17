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
    const existingUser = await authRepository.findUserByEmail(input.email)

    if (existingUser) {
        throw new Error("El correo ya está registrado")
    }

    const passwordHash = await bcrypt.hash(input.password, 10)

    const user = await authRepository.createUser({
        username: input.username,
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone ?? null,
        address: input.address ?? null
    })

    return user
}

export const loginUser = async (input: Login) => {
    const user = await authRepository.findUserByEmail(input.email)

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