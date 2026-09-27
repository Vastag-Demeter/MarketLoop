// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

export const seedProducts = async (prisma) => {
  try {
    //Insert categories
    console.log("Starting seeding categories.");
    const categories = [
      ["Tech & Gaming", "tech_gaming"],
      ["Fashion & Style", "fashion_style"],
      ["Home & Living", "home_living"],
      ["Health & Beauty", "health_beauty"],
      ["Outdoor & Sports", "outdoor_sports"],
    ];
    let insertedCategories = [];
    for (const [name, slug] of categories) {
      const cat = await prisma.categories.upsert({
        where: {
          name: name,
        },
        update: {},
        create: {
          name: name,
          slug: slug,
        },
        select: {
          id: true,
        },
      });
      insertedCategories.push(cat);
    }

    //Insert subcategories
    console.log("Starting seeding subcategories");
    const subCategories = [
      // Tech & Gaming (Parent ID: 1)
      ["Video Cards", "gpu"],
      ["Gaming Laptops", "gaming_laptops"],
      ["Monitors", "monitors"],
      // Fashion & Style (Parent ID: 2)
      ["T-Shirts", "t_shirts"],
      ["Hoodies", "hoodies"],
      ["Sneakers", "sneakers"],
      // Home & Living (Parent ID: 3)
      ["Desks", "desks"],
      ["Lighting", "lighting"],
      ["Kitchen Appliances", "kitchen_app"],
      // Health & Beauty (Parent ID: 4)
      ["Perfumes", "perfumes"],
      ["Face Care", "face_care"],
      ["Vitamins", "vitamins"],
      // Outdoor & Sports (Parent ID: 5)
      ["Running", "running"],
      ["Gym Equipment", "gym_equip"],
      ["Electric Bikes", "ebikes"],
    ];

    let i = 0;
    for (const [name, slug] of subCategories) {
      await prisma.categories.upsert({
        where: {
          name: name,
        },
        update: {},
        create: {
          name: name,
          slug: slug,
          parent_id: insertedCategories[Math.floor(i / 3)].id,
        },
      });
      i++;
    }
    console.log("Starting seeding vendors");
    const vendors = [
      "TechStore",
      "FashionHub",
      "HomeEssentials",
      "BeautyWorld",
      "OutdoorGear",
      "Asus Official",
      "Nike Factory",
      "Logitech G",
      "Samsung Electronics",
      "IKEA Partner",
    ];
    for (const vendorName of vendors) {
      await prisma.vendors.upsert({
        where: {
          name: vendorName,
        },
        update: {},
        create: {
          name: vendorName,
        },
      });
    }

    console.log("Starting seeding products");
    const products = [
      {
        sku: "TECH-KB-01",
        name: "Mechanical Keyboard",
        description:
          "A mechanical keyboard with RGB ligting. Contains brown switches.",
        category_id: 8,
        vendor_id: 8,
        base_price: 129.99,
      },
      {
        sku: "HOME-MUG-BLUE",
        name: "Cheramic Mug",
        description: "Hand-painted cheramic mug.",
        category_id: 14,
        vendor_id: 3,
        base_price: 14.99,
      },
      {
        sku: "SPORT-BOT-750",
        name: "Sport water bottle",
        description: "BPA-free water bottle.",
        category_id: 18,
        vendor_id: 5,
        base_price: 24.99,
      },

      {
        sku: "GPU-RTX-4080",
        name: "Nvidia RTX 4080 Super",
        description: "16GB GDDR6X memory, Ray Tracing support.",
        category_id: 6,
        vendor_id: 6,
        base_price: 999.99,
      },
      {
        sku: "LAP-ROG-ZEPH",
        name: "ROG Zephyrus G14",
        description: "AMD Ryzen 9, 32GB RAM, RTX 4070, OLED display.",
        category_id: 7,
        vendor_id: 6,
        base_price: 1599.99,
      },
      {
        sku: "MON-SAM-G7",
        name: "Samsung Odyssey G7",
        description:
          "32 inch, 240Hz, 1ms responset time, curved gamer monitor.",
        category_id: 8,
        vendor_id: 9,
        base_price: 599.99,
      },

      {
        sku: "FASH-TEE-OVERS",
        name: "Oversized shirt",
        description: "100% organic cotton, comfortable fit.",
        category_id: 9,
        vendor_id: 2,
        base_price: 29.99,
      },
      {
        sku: "FASH-HOOD-GREY",
        name: "Urban Grey Hoodie",
        description: "Heavy, fitted hoodie for urban use.",
        category_id: 10,
        vendor_id: 2,
        base_price: 59.99,
      },
      {
        sku: "SHO-NIKE-AJ1",
        name: "Air Jordan 1 Retro",
        description: "Classic high-top sneakers with a retro look.",
        category_id: 11,
        vendor_id: 7,
        base_price: 180.0,
      },

      {
        sku: "HOME-DESK-ADJ",
        name: "Adjustable Desk",
        description: "Electric motor, 160x80 cm desk.",
        category_id: 12,
        vendor_id: 10,
        base_price: 499.99,
      },
      {
        sku: "HOME-LAMP-SMART",
        name: "Smart LED Desk Lamp",
        description: "Appliance-controlled, adjustable brightness.",
        category_id: 13,
        vendor_id: 9,
        base_price: 79.99,
      },

      {
        sku: "BEAU-PERF-BLU",
        name: "Bleu de Chanel 100ml",
        description: "Fresh, fancy look for men.",
        category_id: 15,
        vendor_id: 4,
        base_price: 180.0,
      },
      {
        sku: "SPORT-BIKE-E1",
        name: "Specialized Turbo Vado",
        description: "Electric touring bike with 500Wh accumulator.",
        category_id: 20,
        vendor_id: 5,
        base_price: 3999.99,
      },
      {
        sku: "SPORT-DUMB-SET",
        name: "Adjustable Weight Set",
        description: "2x20kg set, practical in a gym bag.",
        category_id: 19,
        vendor_id: 5,
        base_price: 199.99,
      },
    ];
    for (const prod of products) {
      await prisma.products.upsert({
        where: {
          sku: prod.sku,
        },
        update: {},
        create: {
          sku: prod.sku,
          name: prod.name,
          description: prod.description,
          category_id: prod.category_id,
          vendor_id: prod.vendor_id,
          base_price: prod.base_price,
        },
      });
    }

    //Insert attributes
    const attributeNames = [
      "SIZE",
      "COLOR",
      "MATERIAL",
      "WEIGHT",
      "BRAND",
      "WARRANTY",
      "COMPATIBILITY",
      "VOLTAGE",
      "VOLUME",
      "REFRESH_RATE",
      "MEMORY_CAPACITY",
      "FRAGRANCE_TYPE",
      "GENDER",
    ];
    for (const name of attributeNames) {
      await prisma.attributes.upsert({
        where: {
          name: name,
        },
        update: {},
        create: {
          name: name,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
};
