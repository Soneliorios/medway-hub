import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/shared/Navbar";
import { CatalogClient } from "@/components/catalog/CatalogClient";

export default async function CatalogPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  const featured = projects.filter((p) => p.isFeatured).slice(0, 3);

  // Group by category in DB-defined order
  const categoryOrder = categories.map((c) => c.name);
  const byCategory: Record<string, typeof projects> = {};

  for (const cat of categoryOrder) {
    const items = projects.filter((p) => p.category === cat);
    if (items.length > 0) byCategory[cat] = items;
  }
  // Projects with categories not (yet) in DB
  for (const p of projects) {
    if (!categoryOrder.includes(p.category)) {
      byCategory[p.category] = [...(byCategory[p.category] ?? []), p];
    }
  }

  // Serialize dates for client components
  const serialize = (p: (typeof projects)[number]) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--mw-bg-base)" }}>
      <Navbar />
      <main className="pt-16">
        <CatalogClient
          featured={featured.map(serialize)}
          byCategory={Object.fromEntries(
            Object.entries(byCategory).map(([k, v]) => [k, v.map(serialize)])
          )}
        />
      </main>
    </div>
  );
}
