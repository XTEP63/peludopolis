import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "../utils/jwt"

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return res.status(401).json({
                ok: false,
                message: "Token no proporcionado"
            })
        }

        const [scheme, token] = authorization.split(" ")

        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                ok: false,
                message: "Formato de token inválido"
            })
        }

        const decoded = verifyAccessToken(token)

        req.user = decoded

        next()
    } catch {
        return res.status(401).json({
        ok: false,
        message: "Token inválido o expirado"
        })
    }
}