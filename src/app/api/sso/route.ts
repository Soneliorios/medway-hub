import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { signHubToken } from "@/lib/sso";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { projectId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { projectId } = body;
  if (!projectId) {
    return NextResponse.json({ error: "projectId is required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project || !project.isActive) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const token = await signHubToken({
    sub: (session.user as any).id,
    email: session.user.email!,
    role: (session.user as any).role,
    projectId,
  });

  return NextResponse.json({ token });
}
