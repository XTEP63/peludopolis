import express from "express"
import cors from "cors"
import path from "path"
import { env } from "./config/env"
import authRoutes from './api/auth.routes'
import adminRoutes from "./api/admin.routes";

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

app.use('/auth', authRoutes)
app.use("/admin", adminRoutes);

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