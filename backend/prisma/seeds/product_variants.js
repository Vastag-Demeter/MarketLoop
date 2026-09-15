export const seedVariants = async (prisma) => {
  console.log("Starting comprehensive variant seeding...");

  // Segédadatok lekérése
  const products = await prisma.products.findMany();
  const allAttributes = await prisma.attributeValues.findMany({
    include: { attribute: true },
  });

  // 1. Alapértelmezett "Fekete" variáns minden termékhez
  console.log("Creating default black variants for all products...");
  const blackColor = allAttributes.find(
    (a) => a.value === "Fekete" && a.attribute.name === "COLOR",
  );

  for (const product of products) {
    const variant = await prisma.productVariants.upsert({
      where: { variant_sku: `${product.sku}-BLK` },
      update: {},
      create: {
        product_id: product.id,
        variant_sku: `${product.sku}-BLK`,
        stock: 50,
        price_modifier: 0.0,
      },
    });

    if (blackColor) {
      await prisma.variantAttributeValues.createMany({
        data: [{ variant_id: variant.id, attribute_value_id: blackColor.id }],
        skipDuplicates: true,
      });
    }
  }

  // 2. Specifikus variánsok létrehozása (Példa adatok)
  const extraVariants = [
    // Mechanikus Billentyűzet (TECH-KB-01) - Fehér kiadás
    {
      product_sku: "TECH-KB-01",
      variant_sku: "TECH-KB-01-WHT",
      price_modifier: 2000.0,
      stock: 15,
      attrs: [
        { name: "COLOR", value: "Fehér" },
        { name: "WARRANTY", value: "2 years" },
      ],
    },
    // Oversized Fekete Póló (FASH-TEE-OVERS) - Különböző méretek
    {
      product_sku: "FASH-TEE-OVERS",
      variant_sku: "FASH-TEE-OVERS-L",
      price_modifier: 0.0,
      stock: 100,
      attrs: [
        { name: "COLOR", value: "Fekete" },
        { name: "SIZE", value: "L" },
      ],
    },
    {
      product_sku: "FASH-TEE-OVERS",
      variant_sku: "FASH-TEE-OVERS-S",
      price_modifier: 0.0,
      stock: 45,
      attrs: [
        { name: "COLOR", value: "Fekete" },
        { name: "SIZE", value: "S" },
      ],
    },
    // Air Jordan 1 (SHO-NIKE-AJ1) - Piros, 42-es (ha van ilyen attr)
    {
      product_sku: "SHO-NIKE-AJ1",
      variant_sku: "SHO-NIKE-AJ1-RED-42",
      price_modifier: 5000.0,
      stock: 5,
      attrs: [
        { name: "COLOR", value: "Piros" },
        { name: "SIZE", value: "42" },
      ],
    },
    // Kerámia Bögre (HOME-MUG-BLUE) - Egyedi méret
    {
      product_sku: "HOME-MUG-BLUE",
      variant_sku: "HOME-MUG-BLUE-750",
      price_modifier: 800.0,
      stock: 30,
      attrs: [
        { name: "COLOR", value: "Kék" },
        { name: "VOLUME", value: "750ml" },
      ],
    },
  ];

  console.log("Creating specific attribute-rich variants...");
  for (const vData of extraVariants) {
    const product = products.find((p) => p.sku === vData.product_sku);
    if (!product) continue;

    const variant = await prisma.productVariants.upsert({
      where: { variant_sku: vData.variant_sku },
      update: { stock: vData.stock, price_modifier: vData.price_modifier },
      create: {
        product_id: product.id,
        variant_sku: vData.variant_sku,
        stock: vData.stock,
        price_modifier: vData.price_modifier,
      },
    });

    // Attribútumok összekötése
    for (const attrMatch of vData.attrs) {
      const targetAttr = allAttributes.find(
        (a) =>
          a.value === attrMatch.value && a.attribute.name === attrMatch.name,
      );

      if (targetAttr) {
        await prisma.variantAttributeValues.createMany({
          data: [{ variant_id: variant.id, attribute_value_id: targetAttr.id }],
          skipDuplicates: true,
        });
      }
    }
  }

  console.log("Comprehensive variant seeding finished.");
};
