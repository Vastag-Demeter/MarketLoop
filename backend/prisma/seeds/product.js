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

    //Insert products
    console.log("Starting seeding products");
    const products = [
      // Eredetiek megtartva...
      {
        sku: "ALSIKM",
        name: "Best Product",
        description: "This is the description of the product",
        category_id: 1,
        vendor_id: 1,
        base_price: 10.0,
      },
      {
        sku: "TECH-KB-01",
        name: "Mechanikus Billentyűzet",
        description: "RGB világítású, barna kapcsolós mechanikus billentyűzet.",
        category_id: 8,
        vendor_id: 8,
        base_price: 25990.0,
      },
      {
        sku: "HOME-MUG-BLUE",
        name: "Kerámia Bögre - Kék",
        description: "350ml-es, kézzel festett kék kerámia bögre.",
        category_id: 14,
        vendor_id: 3,
        base_price: 1500.0,
      },
      {
        sku: "SPORT-BOT-750",
        name: "Sport Kulacs 750ml",
        description: "BPA-mentes műanyag kulacs, cseppmentes záródással.",
        category_id: 18,
        vendor_id: 5,
        base_price: 3200.0,
      },

      // Új Tech termékek
      {
        sku: "GPU-RTX-4080",
        name: "Nvidia RTX 4080 Super",
        description: "16GB GDDR6X memória, Ray Tracing támogatás.",
        category_id: 6,
        vendor_id: 6,
        base_price: 480000.0,
      },
      {
        sku: "LAP-ROG-ZEPH",
        name: "ROG Zephyrus G14",
        description: "AMD Ryzen 9, 32GB RAM, RTX 4070, OLED kijelző.",
        category_id: 7,
        vendor_id: 6,
        base_price: 750000.0,
      },
      {
        sku: "MON-SAM-G7",
        name: "Samsung Odyssey G7",
        description: "32 inch, 240Hz, 1ms válaszidő, ívelt gamer monitor.",
        category_id: 8,
        vendor_id: 9,
        base_price: 185000.0,
      },

      // Új Fashion termékek
      {
        sku: "FASH-TEE-OVERS",
        name: "Oversized Fekete Póló",
        description: "100% organikus pamut, kényelmes viselet.",
        category_id: 9,
        vendor_id: 2,
        base_price: 8900.0,
      },
      {
        sku: "FASH-HOOD-GREY",
        name: "Urban Grey Hoodie",
        description: "Vastag, bélelt kapucnis pulóver téli napokra.",
        category_id: 10,
        vendor_id: 2,
        base_price: 18500.0,
      },
      {
        sku: "SHO-NIKE-AJ1",
        name: "Air Jordan 1 Retro",
        description: "Klasszikus magas szárú kosárlabda cipő.",
        category_id: 11,
        vendor_id: 7,
        base_price: 65000.0,
      },

      // Új Home termékek
      {
        sku: "HOME-DESK-ADJ",
        name: "Állítható Magasságú Asztal",
        description: "Elektromos motorral, 160x80 cm-es asztallap.",
        category_id: 12,
        vendor_id: 10,
        base_price: 120000.0,
      },
      {
        sku: "HOME-LAMP-SMART",
        name: "Okos LED Asztali Lámpa",
        description: "Applikációval vezérelhető, állítható színhőmérséklet.",
        category_id: 13,
        vendor_id: 9,
        base_price: 14900.0,
      },

      // Új Beauty & Sport
      {
        sku: "BEAU-PERF-BLU",
        name: "Bleu de Chanel 100ml",
        description: "Friss, fás illat férfiaknak.",
        category_id: 15,
        vendor_id: 4,
        base_price: 42000.0,
      },
      {
        sku: "SPORT-BIKE-E1",
        name: "Specialized Turbo Vado",
        description: "Elektromos trekking kerékpár 500Wh akkumulátorral.",
        category_id: 20,
        vendor_id: 5,
        base_price: 1250000.0,
      },
      {
        sku: "SPORT-DUMB-SET",
        name: "Állítható Súlyzó Szett",
        description: "2x20kg-os szett, praktikus hordozótáskában.",
        category_id: 19,
        vendor_id: 5,
        base_price: 29900.0,
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
      "REFRESH_RATE", // Monitorokhoz
      "MEMORY_CAPACITY", // GPU / Laptophoz
      "FRAGRANCE_TYPE", // Parfümökhöz
      "GENDER", // Ruházathoz
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
