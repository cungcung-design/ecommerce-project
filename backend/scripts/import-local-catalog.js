import { readFileSync } from "fs";
import prisma from "../src/lib/prisma.js";

const catalog = JSON.parse(
  readFileSync(new URL("../data/local-catalog.json", import.meta.url), "utf8")
);

async function main() {
  const names = [];

  for (const item of catalog) {
    const category = await prisma.category.upsert({
      where: { name: item.category },
      update: { isActive: true },
      create: { name: item.category, isActive: true },
    });

    const data = {
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      isActive: item.isActive !== false,
      imageUrl: item.imageUrl,
      imagePublicId: item.imagePublicId,
      categoryId: category.id,
    };

    const existing = await prisma.product.findFirst({
      where: { name: item.name },
    });

    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data });
    } else {
      await prisma.product.create({ data });
    }

    names.push(item.name);
  }

  const extras = await prisma.product.findMany({
    where: {
      name: { notIn: names },
      imageUrl: null,
    },
    select: {
      id: true,
      orderItems: { select: { id: true }, take: 1 },
      cartItems: { select: { id: true }, take: 1 },
    },
  });

  for (const extra of extras) {
    if (extra.orderItems.length > 0 || extra.cartItems.length > 0) {
      continue;
    }
    await prisma.product.delete({ where: { id: extra.id } });
  }

  const withImages = await prisma.product.count({
    where: { imageUrl: { not: null }, isActive: true },
  });
  console.log(`Imported ${names.length} products. Active products with images: ${withImages}.`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
