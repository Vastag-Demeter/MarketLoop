import { PrismaClient } from "@prisma/client";
import { seedUser } from "./seeds/user.js";
import { seedProducts } from "./seeds/product.js";
import { seedSystemDefaults } from "./seeds/system_defaults.js";
import { seedAttributeValues } from "./seeds/attributes.js";
import { seedLocations } from "./seeds/locations.js";
import { seedVariants } from "./seeds/product_variants.js";
import { seedProductImages } from "./seeds/product_images.js";
import { seedCreditCards } from "./seeds/credit_card.js";
import { seedStatuses } from "./seeds/statuses.js";
import { seedRoles } from "./seeds/roles.js";
const prisma = new PrismaClient();

const main = async () => {
  await seedRoles(prisma);
  await seedUser(prisma);
  await seedCreditCards(prisma);
  await seedProducts(prisma);
  await seedSystemDefaults(prisma);
  await seedAttributeValues(prisma);
  await seedLocations(prisma);
  await seedVariants(prisma);
  await seedProductImages(prisma);
  await seedStatuses(prisma);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
