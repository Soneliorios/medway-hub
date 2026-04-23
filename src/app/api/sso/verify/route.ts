import { NextResponse } from "next/server";
import { verifyHubToken } from "@/lib/sso";

// This endpoint is PUBLIC — no session required
// External projects call it to validate hub_token
export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { token } = body;
  if (!token) {
    return NextResponse.json({ error: "token is required" }, { status: 400 });
  }

  try {
    const payload = await verifyHubToken(token);
    return NextResponse.json({
      valid: true,
      user: {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        projectId: payload.projectId,
      },
    });
  } catch {
    return NextResponse.json(
      { valid: false, error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}
