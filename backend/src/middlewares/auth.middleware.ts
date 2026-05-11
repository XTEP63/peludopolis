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

/*Ensures the authenticated user has the 'admin' role.
Must always be chained AFTER verifyToken.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    /* No ha hecho login*/
    if (!req.user) {
        return res.status(401).json({
            ok: false,
            message: "No autenticado",
        });
    }

    /*si no hay role de amdin*/
    if (req.user.role !== "admin") {
        return res.status(403).json({
            ok: false,
            message: "Acceso denegado: se requiere rol de administrador",
        });
    }

    next();
};