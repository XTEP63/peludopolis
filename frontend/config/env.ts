import dotenv from "dotenv";

dotenv.config();

const requiredEnvs = ["PORT"] as const;

for (const envName of requiredEnvs) {
  if (!process.env[envName]) {
    throw new Error(`Falta la variable de entorno: ${envName}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
};