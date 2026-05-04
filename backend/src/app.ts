import express from "express"
import cors from "cors"
import { env } from "./config/env"
import authRoutes from './api/auth.routes'
import adminRoutes from "./api/admin.routes"
import usersRoutes from "./api/users.routes"
import reservationsRoutes from "./api/reservations.routes"
import { AppError } from "./utils/errors"
import { Request, Response, NextFunction } from "express"

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL
  })
)

app.use(express.json())

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "Servidor activo"
  })
})

app.get("/system/info", (_req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      app: "Peludópolis Backend",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString()
    }
  })
})

app.use('/auth', authRoutes);
app.use("/admin", adminRoutes);
app.use("/users", usersRoutes);
app.use("/reservations", reservationsRoutes);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            ok: false,
            message: err.message
        });
    }

    return res.status(500).json({
        ok: false,
        message: "Error interno del servidor"
    });
});

export default app;