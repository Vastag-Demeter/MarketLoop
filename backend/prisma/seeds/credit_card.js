export const seedCreditCards = async (prisma) => {
  console.log("Starting seeding credit cards.");

  // Megkeressük a Customer felhasználót az email címe alapján (biztosabb, mint az ID)
  const customer = await prisma.user.findUnique({
    where: { email: "customer@webshop" },
  });

  if (!customer) {
    console.error("Customer user not found. Please seed users first!");
    return;
  }

  const creditCards = [
    {
      user_id: customer.id,
      card_token: "tok_1N2j3k4L5m6n7o8p", // Fiktív Stripe-szerű token
      last_four: "4242",
      expiration_date: "12/28",
      card_type: "Visa",
    },
    {
      user_id: customer.id,
      card_token: "tok_9Z8y7x6W5v4u3t2s",
      last_four: "5555",
      expiration_date: "08/27",
      card_type: "MasterCard",
    },
  ];

  for (const card of creditCards) {
    await prisma.creditCards.upsert({
      where: { card_token: card.card_token },
      update: {},
      create: card,
    });
  }

  console.log("Credit card seeding finished.");
};
