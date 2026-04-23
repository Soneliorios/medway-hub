import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@medway.com.br";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@123456";
  const adminName = process.env.SEED_ADMIN_NAME ?? "Administrador Medway";

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`✅ Admin criado: ${adminEmail}`);

  const defaultCategories = [
    { name: "Medical Clinic", color: "#407EC9", displayOrder: 0 },
    { name: "Surgery",        color: "#00EFC8", displayOrder: 1 },
    { name: "G.O.",           color: "#AC145A", displayOrder: 2 },
    { name: "Pediatrics",     color: "#FFB81C", displayOrder: 3 },
    { name: "Preventive",     color: "#3B3FB6", displayOrder: 4 },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${defaultCategories.length} categorias criadas`);

  const count = await prisma.project.count();
  console.log(`ℹ️  Projetos existentes: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
