import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mingzhepai-default-secret-change-in-production"
);
const COOKIE_NAME = "admin_token";

export interface AdminSession {
  authenticated: boolean;
}

export async function createToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return { authenticated: false };
  const valid = await verifyToken(token);
  return { authenticated: valid };
}

export function checkPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || "mingzhepai";
  return password === adminPassword;
}

export { COOKIE_NAME };
