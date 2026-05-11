import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  sub: string;
  email: string;
  role: "admin" | "cliente";
}

export const signAccessToken = (payload: JwtPayload) => {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.JWT_SECRET as Secret, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
};
