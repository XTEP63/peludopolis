import app from "./app";
import { env } from "./config/env";
import pool from "./config/db";

const startServer = async () => {
  try {
    await pool.query("SELECT NOW()");

    app.listen(env.PORT, () => {
      console.log(`🚀 Backend corriendo en http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();