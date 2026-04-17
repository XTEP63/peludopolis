import express from "express"
import cors from "cors"
import { env } from "./config/env"
import authRoutes from './api/auth.routes'

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL
  })
)

app.use(express.json())

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "API de Peludópolis funcionando"
  })
})

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

export default app;