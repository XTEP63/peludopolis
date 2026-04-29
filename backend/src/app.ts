import express from "express"
import cors from "cors"
import path from "path"
import { env } from "./config/env"
import authRoutes from './api/auth.routes'
import adminRoutes from "./api/admin.routes"
import { AppError } from "./utils/errors"
import { Request, Response, NextFunction } from "express"

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL
  })
)

app.use(express.json())

// Servir archivos del frontend
app.use(
  express.static(
    path.join(__dirname, "../../frontend/src")
  )
)

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

// Página de inicio
app.get("/", (_req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/src/pages/index.html")
  )
})

// Página de reviews
app.get("/reviews", (_req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/src/pages/reviews.html")
  )
})

// Página de habitaciones
app.get("/habitaciones", (_req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend/src/pages/habitaciones.html")
  )
})

export default app;