export const seedAttributeValues = async (prisma) => {
  console.log("Starting seeding attribute values.");

  const attributes = await prisma.attributes.findMany();
  const sizeAttr = attributes.find((a) => a.name === "SIZE");
  const colorAttr = attributes.find((a) => a.name === "COLOR");

  if (sizeAttr) {
    const sizes = ["S", "M", "L", "XL", "XXL", "350ml", "750ml"];
    for (const s of sizes) {
      await prisma.attributeValues.createMany({
        data: { attribute_id: sizeAttr.id, value: s },
        skipDuplicates: true,
      });
    }
  }

  if (colorAttr) {
    const colors = ["Fekete", "Fehér", "Piros", "Kék", "Ezüst", "RGB"];
    for (const c of colors) {
      await prisma.attributeValues.createMany({
        data: { attribute_id: colorAttr.id, value: c },
        skipDuplicates: true,
      });
    }
  }
};
