import { Request, Response, NextFunction } from "express"
import * as authService from "../services/auth.service"

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.registerUser(req.body)

        res.status(201).json({
            ok: true,
            message: "Usuario registrado correctamente",
            data: user
        });
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await authService.loginUser(req.body)

        res.status(200).json({
            ok: true,
            message: "Login exitoso",
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUser = req.user

        if (!authUser) {
            return res.status(401).json({
                ok: false,
                message: "No autenticado"
            })
        }

        const user = await authService.getCurrentUser(Number(authUser.sub))

        res.status(200).json({
            ok: true,
            message: "Usuario autenticado",
            data: user
        })
    } catch (error) {
        next(error)
    }
}