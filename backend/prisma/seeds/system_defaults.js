export const seedSystemDefaults = async (prisma) => {
  console.log("Starting seeding system defaults.");

  // Order Statuses
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
      update: {},
      create: status,
    });
  }

  // Payment Methods
  const paymentMethods = [
    "CREDIT_CARD",
    "PAYPAL",
    "BANK_TRANSFER",
    "CASH_ON_DELIVERY",
  ];
  for (const method of paymentMethods) {
    await prisma.paymentMethods.upsert({
      where: { name: method },
      update: {},
      create: { name: method },
    });
  }

  // Email Types
  const emailTypes = [
    "VERIFICATION",
    "USER_ACTIVATION",
    "ORDER_CONFIRMATION",
    "ORDER_STATUS_UPDATE",
    "HELPDESK",
  ];
  for (const type of emailTypes) {
    await prisma.emailTypes.create({
      data: {
        name: type,
      },
    });
  }

  // Support Ticket Statuses
  const ticketStatuses = [
    "OPEN",
    "WAITING_FOR_AGENT",
    "WAITING_FOR_CUSTOMER",
    "CLOSED",
  ];
  for (const status of ticketStatuses) {
    await prisma.supportTicketStatuses.create({
      data: {
        name: status,
      },
    });
  }
};
