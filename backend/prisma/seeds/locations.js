export const seedLocations = async (prisma) => {
  console.log("Starting seeding locations.");

  // Countries
  const country = await prisma.countries.upsert({
    where: { name: "Magyarország" },
    update: {},
    create: { name: "Magyarország" },
  });

  // Cities
  const cities = [
    { name: "Budapest", postal_code: "1051" },
    { name: "Debrecen", postal_code: "4000" },
    { name: "Szeged", postal_code: "6700" },
  ];

  for (const city of cities) {
    await prisma.cities.upsert({
      where: {
        name_postal_code: { name: city.name, postal_code: city.postal_code },
      },
      update: {},
      create: city,
    });
  }

  // Streets
  const streets = ["Fő utca", "Kossuth Lajos utca", "Petőfi Sándor utca"];
  for (const streetName of streets) {
    await prisma.streets.upsert({
      where: { name: streetName },
      update: {},
      create: { name: streetName },
    });
  }
};
