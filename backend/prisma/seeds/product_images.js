export const seedProductImages = async (prisma) => {
  console.log("Starting seeding product images.");

  const images = [
    {
      sku: "TECH-KB-01",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535099/mechanical_keyboard.jpg",
    },
    {
      sku: "HOME-MUG-BLUE",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535093/cheramic_mug.jpg",
    },
    {
      sku: "SPORT-BOT-750",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535037/p1qgjtadzns8tbusyq7h.jpg",
    },
    {
      sku: "GPU-RTX-4080",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535090/nvidia_rtx_4080_super.jpg",
    },
    {
      sku: "LAP-ROG-ZEPH",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535098/g_14_laptop.jpg",
    },
    {
      sku: "MON-SAM-G7",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535098/samsung_odyssey.jpg",
    },
    {
      sku: "FASH-TEE-OVERS",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535091/oversized_shirt.jpg",
    },
    {
      sku: "FASH-HOOD-GREY",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535099/urban_hoodie.jpg",
    },
    {
      sku: "SHO-NIKE-AJ1",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535097/air_hordan_1_retro.jpg",
    },
    {
      sku: "HOME-DESK-ADJ",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535091/adjustable_desk.jpg",
    },
    {
      sku: "HOME-LAMP-SMART",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535094/smart_led_desk_lamp.jpg",
    },
    {
      sku: "BEAU-PERF-BLU",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535094/bleu_de_chanel.jpg",
    },
    {
      sku: "SPORT-BIKE-E1",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535098/specialized_turbo_vado.jpg",
    },
    {
      sku: "SPORT-DUMB-SET",
      url: "https://res.cloudinary.com/dkqzv5npa/image/upload/v1790535097/adjustable_weight_set.jpg",
    },
  ];

  for (const image of images) {
    const product = await prisma.products.findUnique({
      where: { sku: image.sku },
      select: { id: true },
    });

    if (!product) {
      throw new Error(
        `Cannot seed image: product "${image.sku}" was not found.`,
      );
    }

    const existingImage = await prisma.productImages.findFirst({
      where: { product_id: product.id, sort_order: 1 },
      orderBy: { id: "asc" },
    });

    if (existingImage) {
      await prisma.productImages.update({
        where: { id: existingImage.id },
        data: { url: image.url },
      });
    } else {
      await prisma.productImages.create({
        data: {
          product_id: product.id,
          url: image.url,
          sort_order: 1,
        },
      });
    }
  }
};
