export const seedProductImages = async (prisma) => {
  console.log("Starting seeding product images.");

  const products = await prisma.products.findMany();
  const imageUrl =
    "https://res.cloudinary.com/dkqzv5npa/image/upload/v1773690073/fdxoiwwf2f5pqykwmkqx.jpg";

  for (const product of products) {
    await prisma.productImages.upsert({
      where: { id: product.id },
      update: {},
      create: {
        product_id: product.id,
        url: imageUrl,
        sort_order: 1,
      },
    });
  }
};
