import {
  isEmptyOrWhiteSpace,
  isEmptyOrWhiteSpaceList,
} from "../functions/functions.js";
import prisma from "../constants/db.js";

export const getProductImages = async (req, res) => {
  const productID = parseInt(req.params.productID);
  if (!Number.isInteger(productID)) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    const productImages = await prisma.productImages.findMany({
      where: {
        product_id: productID,
      },
      select: {
        id: true,
        url: true,
        sort_order: true,
      },
      orderBy: {
        sort_order: "asc",
      },
    });
    return res.status(200).json({ data: productImages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addProductImage = async (req, res) => {
  const { product_id, sort_order, url } = req.body;
  try {
    const image = await prisma.productImages.findFirst({
      where: {
        OR: [{ sort_order: sort_order }, { url: url }],
      },
    });

    if (image)
      return res
        .status(400)
        .json({ error: "Image found with the given sort order or url." });

    const createdProductImage = await prisma.productImages.create({
      data: {
        product_id: product_id,
        sort_order: sort_order,
        url: url,
      },
    });
    return res
      .status(201)
      .json({ msg: "Image added successfully", data: createdProductImage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProductImage = async (req, res) => {
  const id = req.body.id;
  const productID = req.body.product_id;
  const { sort_order } = req.body;
  const updatedParams = {};
  if (sort_order) updatedParams.sort_order = sort_order;

  try {
    const productImage = await prisma.productImages.findFirst({
      where: {
        id: id,
      },
    });

    const imageWithSameOrder = await prisma.productImages.findFirst({
      where: {
        product_id: productID,
        sort_order: sort_order,
      },
    });

    if (!productImage) {
      return res.status(404).json({ error: "Image not found" });
    }
    if (imageWithSameOrder.id !== id)
      return res
        .status(400)
        .json({ error: "Image with the given sort order already exists." });

    const updatedImage = await prisma.productImages.update({
      where: {
        id: id,
      },
      data: updatedParams,
    });

    return res
      .status(202)
      .json({ msg: "Image updated successfully", data: updatedImage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductImage = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Image ID is required" });
  }
  try {
    const productImage = await prisma.productImages.findFirst({
      where: { id: id },
    });
    if (!productImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    await prisma.productImages.delete({
      where: {
        id: id,
      },
    });
    return res.status(202).json({ msg: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
