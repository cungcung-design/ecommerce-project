import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },

    update: {
      role: "ADMIN",
      isActive: true,
    },

    create: {
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });

  const electronics =
    await prisma.category.upsert({
      where: {
        name: "Electronics",
      },

      update: {},

      create: {
        name: "Electronics",
      },
    });

  const fashion =
    await prisma.category.upsert({
      where: {
        name: "Fashion",
      },

      update: {},

      create: {
        name: "Fashion",
      },
    });

  console.log("Categories created:");
  console.log({
    electronics: electronics.name,
    fashion: fashion.name,
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Headphones",
        description: "Premium wireless headphones",
        price: 79.99,
        stock: 25,
        categoryId: electronics.id,
      },
      {
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard",
        price: 89.99,
        stock: 15,
        categoryId: electronics.id,
      },
      {
        name: "Classic T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 19.99,
        stock: 50,
        categoryId: fashion.id,
      },
    ],
  });

  console.log("Products created:");
  console.log("  - Wireless Headphones ($79.99, Electronics)");
  console.log("  - Mechanical Keyboard ($89.99, Electronics)");
  console.log("  - Classic T-Shirt ($19.99, Fashion)");

  console.log("✅ Database seeded successfully");
}

main()
  .catch((error) => {
    console.error("SEED ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

