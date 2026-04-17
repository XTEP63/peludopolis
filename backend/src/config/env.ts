import dotenv from "dotenv";

dotenv.config();

const requiredEnvs = [
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN"
] as const;

for (const envName of requiredEnvs) {
  if (!process.env[envName]) {
    throw new Error(`Falta la variable de entorno: ${envName}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5500"
};