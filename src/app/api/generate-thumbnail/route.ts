import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") ?? "").trim();
  const description = (searchParams.get("description") ?? "").trim();
  const category = (searchParams.get("category") ?? "").trim();

  const prompt = [
    "professional medical education platform",
    name,
    description,
    category,
    "dark navy blue background, modern UI, medical imagery, high quality",
  ]
    .filter(Boolean)
    .join(", ")
    .slice(0, 400);

  const seed = Math.floor(Math.random() * 99999);
  const pollinationsUrl =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=800&height=450&nologo=true&seed=${seed}`;

  try {
    const res = await fetch(pollinationsUrl, {
      headers: { "User-Agent": "MedwayHub/1.0" },
    });

    if (!res.ok) {
      throw new Error(`Pollinations returned ${res.status}`);
    }

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}
