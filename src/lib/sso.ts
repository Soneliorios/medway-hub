import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const secret = process.env.SSO_SECRET;
  if (!secret) throw new Error("SSO_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

export interface HubTokenPayload {
  sub: string;
  email: string;
  role: string;
  projectId: string;
  iat?: number;
  exp?: number;
}

export async function signHubToken(payload: Omit<HubTokenPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecret());
}

export async function verifyHubToken(token: string): Promise<HubTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as HubTokenPayload;
}
