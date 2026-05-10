import { Request, Response, NextFunction } from "express"
import * as usersService from "../services/users.service"

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUser = req.user

        if (!authUser) {
            return res.status(401).json({
                ok: false,
                message: "No autenticado"
            })
        }

        const user = await usersService.getCurrentUser(Number(authUser.sub))

        res.status(200).json({
            ok: true,
            message: "Perfil obtenido correctamente",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authUser = req.user

        if (!authUser) {
            return res.status(401).json({
                ok: false,
                message: "No autenticado"
            })
        }

        const updatedUser = await usersService.updateCurrentUser(Number(authUser.sub), req.body)

        res.status(200).json({
            ok: true,
            message: "Perfil actualizado correctamente",
            data: updatedUser
        })
    } catch (error) {
        next(error)
    }
}