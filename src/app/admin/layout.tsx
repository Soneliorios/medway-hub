import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — Medway Hub",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "admin") {
    redirect("/?error=forbidden");
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--mw-bg-base)" }}
    >
      <AdminSidebar />
      <main
        className="ml-60 min-h-screen p-8"
        style={{ background: "var(--mw-bg-base)" }}
      >
        {children}
      </main>
    </div>
  );
}
