export const seedStatuses = async (prisma) => {
  console.log("Starting seeding Order and Transaction statuses.");

  const orderStatuses = [
    { name: "PENDING", is_final: false },
    { name: "PAID", is_final: false },
    { name: "SHIPPED", is_final: false },
    { name: "DELIVERED", is_final: true },
    { name: "CANCELLED", is_final: true },
    { name: "REFUNDED", is_final: true },
  ];

  for (const status of orderStatuses) {
    await prisma.orderStatuses.upsert({
      where: { name: status.name },
      update: { is_final: status.is_final },
      create: status,
    });
  }
  console.log("Order statuses seeded.");
};
