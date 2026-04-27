"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

// ── Project Actions ────────────────────────────────────────────────────────

export async function createProject(formData: FormData) {
  await requireAdmin();

  await prisma.project.create({
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      embedUrl: formData.get("embedUrl") as string,
      thumbnail: formData.get("thumbnail") as string,
      category: formData.get("category") as string,
      specialtyColor: formData.get("specialtyColor") as string,
      authMethod: (formData.get("authMethod") as string) || "hub_token",
      isActive: formData.getAll("isActive").includes("true"),
      isFeatured: formData.getAll("isFeatured").includes("true"),
      responsibleName: (formData.get("responsibleName") as string) || "",
      teamName: (formData.get("teamName") as string) || "",
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.project.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      embedUrl: formData.get("embedUrl") as string,
      thumbnail: formData.get("thumbnail") as string,
      category: formData.get("category") as string,
      specialtyColor: formData.get("specialtyColor") as string,
      authMethod: (formData.get("authMethod") as string) || "hub_token",
      isActive: formData.getAll("isActive").includes("true"),
      isFeatured: formData.getAll("isFeatured").includes("true"),
      responsibleName: (formData.get("responsibleName") as string) || "",
      teamName: (formData.get("teamName") as string) || "",
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function toggleProjectStatus(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.project.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

// ── User Actions ───────────────────────────────────────────────────────────

export async function createUser(formData: FormData) {
  await requireAdmin();

  const email = (formData.get("email") as string).toLowerCase().trim();
  const name = formData.get("name") as string;
  const role = (formData.get("role") as string) || "viewer";

  if (!email.endsWith("@medway.com.br")) {
    throw new Error("O e-mail deve ser @medway.com.br");
  }

  const { generateTempPassword, sendWelcomeEmail } = await import("@/lib/email");
  const tempPassword = generateTempPassword();
  const hashedPassword = await bcrypt.hash(tempPassword, 12);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role, mustChangePassword: true },
  });

  // Email is best-effort — user is created even if send fails
  try {
    const hubUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    await sendWelcomeEmail({ name, email, tempPassword, hubUrl });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function changePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const newPassword = formData.get("newPassword") as string;
  const confirm = formData.get("confirm") as string;

  if (!newPassword || newPassword.length < 8) {
    throw new Error("A senha deve ter pelo menos 8 caracteres");
  }
  if (newPassword !== confirm) {
    throw new Error("As senhas não conferem");
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: (session.user as any).id },
    data: { password: hashed, mustChangePassword: false },
  });

  redirect("/");
}

export async function updateUser(id: string, formData: FormData) {
  await requireAdmin();

  const password = formData.get("password") as string;
  const updateData: Record<string, string> = {
    name: formData.get("name") as string,
    email: (formData.get("email") as string).toLowerCase().trim(),
    role: formData.get("role") as string,
  };

  if (password && password.length > 0) {
    updateData.password = await bcrypt.hash(password, 12);
  }

  await prisma.user.update({ where: { id }, data: updateData });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

// ── Category Actions ───────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  await requireAdmin();

  await prisma.category.create({
    data: {
      name: (formData.get("name") as string).trim(),
      color: (formData.get("color") as string) || "#01CFB5",
      displayOrder: parseInt((formData.get("displayOrder") as string) || "0"),
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();

  await prisma.category.update({
    where: { id },
    data: {
      name: (formData.get("name") as string).trim(),
      color: (formData.get("color") as string) || "#01CFB5",
      displayOrder: parseInt((formData.get("displayOrder") as string) || "0"),
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
}

export async function reorderCategories(ids: string[]) {
  await requireAdmin();
  await Promise.all(
    ids.map((id, index) =>
      prisma.category.update({ where: { id }, data: { displayOrder: index } })
    )
  );
  revalidatePath("/admin/categories");
  revalidatePath("/");
}
