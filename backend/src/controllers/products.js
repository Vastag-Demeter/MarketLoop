import {
  isEmptyOrWhiteSpace,
  isEmptyOrWhiteSpaceList,
} from "../functions/functions.js";
import prisma from "../constants/db.js";

export const getActiveProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        description: true,
        base_price: true,
        is_active: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
          },
        },
        images: {
          select: {
            id: true,
            sort_order: true,
            url: true,
          },
        },
      },
    });
    return res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        is_active: true,
        base_price: true,
        images: {
          select: {
            id: true,
            sort_order: true,
            url: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            is_active: true,
            parent_id: true,
          },
        },
      },
    });
    return res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const product = await prisma.products.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        sku: true,
        name: true,
        description: true,
        category: {
          select: {
            name: true,
            id: true,
            is_active: true,
          },
        },
        vendor: {
          select: {
            id: true,
            name: true,
            is_active: true,
          },
        },
        base_price: true,
        images: {
          select: {
            id: true,
            url: true,
            sort_order: true,
          },
        },
        variants: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
            variant_sku: true,
            stock: true,
            price_modifier: true,
            attributeValues: {
              where: {
                is_active: true,
              },
              select: {
                id: true,
                attributeValue: {
                  select: {
                    id: true,
                    value: true,
                    is_active: true,
                    attribute: {
                      select: {
                        id: true,
                        name: true,
                        is_active: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ data: product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addProduct = async (req, res) => {
  const { sku, name, description, category_id, vendor_id, base_price } =
    req.body;
  try {
    const createdProduct = await prisma.products.create({
      data: {
        sku: sku,
        name: name,
        description: description,
        category_id: category_id,
        vendor_id: vendor_id,
        base_price: base_price,
      },
    });

    return res
      .status(201)
      .json({ msg: "Product created successfully.", data: createdProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateProducts = async (req, res) => {
  const id = req.body.id;
  const { sku, name, description, category_id, vendor_id, base_price } =
    req.body;

  const data = {};
  if (sku) data.sku = sku;
  if (name) data.name = name;
  if (description) data.description = description;
  if (category_id) data.category_id = category_id;
  if (vendor_id) data.vendor_id = vendor_id;
  if (base_price) data.base_price = base_price;

  try {
    const updatedProduct = await prisma.products.update({
      where: {
        id: id,
      },
      data: data,
    });
    return res
      .status(200)
      .json({ msg: "Product updated successfully.", data: updatedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeProductActiveness = async (req, res) => {
  const id = req.body.id;
  try {
    const product = await prisma.products.findFirst({
      where: {
        id: id,
      },
    });
    if (!product) return res.status(400).json({ error: "Product not found." });

    const changedProduct = await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        is_active: !product.is_active,
      },
    });

    return res.status(200).json({
      msg: "Product activeness changed successfully.",
      data: changedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
