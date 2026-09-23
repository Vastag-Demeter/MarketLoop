import {
  isEmptyOrWhiteSpace,
  isEmptyOrWhiteSpaceList,
} from "../functions/functions.js";
import prisma from "../constants/db.js";
import { logger } from "../utils/logger.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();
    return res.status(200).json({ data: categories });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getActiveCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        is_active: true,
      },
    });
    return res.status(200).json({ data: categories });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getCategoryById = async (req, res) => {
  const id = req.body.id;
  try {
    const category = await prisma.categories.findUnique({
      where: { id: id },
    });
    if (!category)
      return res.status(404).json({ error: "Category not found." });
    return res.status(200).json({ data: category });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const addCategory = async (req, res) => {
  const { name, parent_id, slug } = req.body;
  try {
    const createdCategory = await prisma.categories.create({
      data: {
        name: name,
        parent_id: parent_id || null,
        slug: slug,
      },
    });
    return res
      .status(201)
      .json({ msg: "Category created successfully.", data: createdCategory });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateCategory = async (req, res) => {
  console.log("UPDATE CALLED");
  const { id, name, parent_id, slug } = req.body;
  let data = {};
  if (!isEmptyOrWhiteSpace(name)) data.name = name;
  if (Number.isInteger(parent_id) || parent_id == null)
    data.parent_id = parent_id;
  if (!isEmptyOrWhiteSpace(slug)) data.slug = slug;
  try {
    const updatedCategory = await prisma.categories.update({
      where: { id: id },
      data: data,
    });
    return res
      .status(200)
      .json({ msg: "Category updated successfully.", data: updatedCategory });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const changeCategoryActiveness = async (req, res) => {
  const id = req.body.id;
  try {
    const category = await prisma.categories.findUnique({
      where: { id: id },
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }
    const changedCategory = await prisma.categories.update({
      where: { id: id },
      data: { is_active: !category.is_active },
    });
    return res.status(200).json({
      msg: "Category activeness status changed successfully.",
      data: changedCategory,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
