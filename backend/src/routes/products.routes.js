import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/auth.js";
import {
  getVendors,
  getVendorById,
  addVendor,
  updateVendor,
  changeVendorActiveness,
  getAllVendors,
} from "../controllers/vendors.js";

import {
  getVendorEmails,
  addVendorEmail,
  updateVendorEmail,
  changeVendorEmailActiveness,
} from "../controllers/vendor_emails.js";

import {
  getProductImages,
  addProductImage,
  updateProductImage,
  deleteProductImage,
} from "../controllers/product_images.js";

import {
  addProduct,
  getActiveProducts,
  getProductById,
  getAllProducts,
  updateProducts,
  changeProductActiveness,
} from "../controllers/products.js";

import {
  getCategories,
  getActiveCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  changeCategoryActiveness,
} from "../controllers/categories.js";

import {
  getActiveAttributes,
  getAllAttributes,
  updateAttribute,
  changeAttributeActiveness,
  addAttribute,
} from "../controllers/attributes.js";

import {
  getAllAttributeValues,
  getAttributeValues,
  addAttributeValue,
  updateAttributeValue,
  changeAttributeValueActiveness,
  getAttributeValuesByVariantId,
} from "../controllers/attribute_values.js";

import {
  getProductVariants,
  getActiveProductVariants,
  getProductVariantById,
  addProductVariant,
  updateProductVariant,
  changeProductVariantActiveness,
} from "../controllers/product_variants.js";
import { validate } from "../middleware/validate.js";
import {
  addCategorySchema,
  changeCategoryActivenessSchema,
  getCategoryByIdSchema,
  updateCategorySchema,
} from "../validators/category.validator.js";
import {
  addVendorSchema,
  changeVendorActivenessSchema,
  getVendorByIdSchema,
  updateVendorSchema,
} from "../validators/vendors.validator.js";
import {
  addVendorEmailSchema,
  changeVendorEmailActivenessSchema,
  getVendorEmailsSchema,
  updateVendorEmailSchema,
} from "../validators/vendorEmail.validator.js";
import {
  addAttributeValueSchema,
  changeAttributeValueActivenessSchema,
  getAttributeValuesSchema,
  updateAttributeValueSchema,
} from "../validators/attributeValue.validator.js";
import {
  addAttributeSchema,
  changeAttributeActivenessSchema,
  updateAttributeSchema,
} from "../validators/attribute.validator.js";
import {
  addProductSchema,
  changeProductActivenessSchema,
  getProductByIdSchema,
  updateProductSchema,
} from "../validators/product.validator.js";
import {
  addProductVariantSchema,
  getProductVariantsSchema,
  updateProductVariantSchema,
} from "../validators/productVariant.validator.js";
import {
  addProductImageSchema,
  updateProductImageSchema,
} from "../validators/productImage.validator.js";
import {
  addAttributeVariant,
  changeAttributeVariantActiveness,
  getActiveAttributeVariants,
  getAttributeVariants,
  updateAttributeVariant,
} from "../controllers/attribute_variants.js";
import {
  addAttributeVariantSchema,
  changeAttributeVariantActivenessSchema,
  updateAttributeVariantSchema,
} from "../validators/variantAttribute.validator.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import { PERMS } from "../constants/roles.js";

//Product image functions
router.get("/getProductImages/:productID", getProductImages);
router.put(
  "/updateProductImage",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(updateProductImageSchema),
  updateProductImage,
);
router.post(
  "/addProductImage",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(addProductImageSchema),
  addProductImage,
);
router.delete(
  "/deleteProductImage/:id",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  deleteProductImage,
);

//Vendor functions
router.get("/getVendors", getVendors);
router.get("/getVendorById", validate(getVendorByIdSchema), getVendorById);
router.get(
  "/getAllVendors",
  authenticateToken,
  checkPermission(PERMS.VENDORS_MANAGE),
  getAllVendors,
);
router.post(
  "/addVendor",
  authenticateToken,
  checkPermission(PERMS.VENDORS_MANAGE),
  validate(addVendorSchema),
  addVendor,
);
router.put(
  "/updateVendor",
  authenticateToken,
  checkPermission(PERMS.VENDORS_MANAGE),
  validate(updateVendorSchema),
  updateVendor,
);
router.patch(
  "/changeVendorActiveness",
  authenticateToken,
  checkPermission(PERMS.VENDORS_MANAGE),
  validate(changeVendorActivenessSchema),
  changeVendorActiveness,
);
//Vendor email functions
router.get(
  "/getVendorEmails",
  validate(getVendorEmailsSchema),
  getVendorEmails,
);
router.post(
  "/addVendorEmail",
  authenticateToken,
  checkPermission(PERMS.VENDORS_MANAGE),
  validate(addVendorEmailSchema),
  addVendorEmail,
);
router.put(
  "/updateVendorEmail",
  authenticateToken,
  checkPermission(PERMS.VENDORS_MANAGE),
  validate(updateVendorEmailSchema),
  updateVendorEmail,
);
router.patch(
  "/changeVendorEmailActiveness",
  authenticateToken,
  checkPermission(PERMS.VENDORS_MANAGE),
  validate(changeVendorEmailActivenessSchema),
  changeVendorEmailActiveness,
);
//Product functions
router.get("/getActiveProducts", getActiveProducts);
router.get(
  "/getAllProducts",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  getAllProducts,
);
router.get("/getProduct/:id", getProductById);
router.post(
  "/addProduct",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(addProductSchema),
  addProduct,
);
router.put(
  "/updateProducts",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(updateProductSchema),
  updateProducts,
);

router.put(
  "/changeProductActiveness",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(changeProductActivenessSchema),
  changeProductActiveness,
);

//Category functions
router.get(
  "/getCategories",
  authenticateToken,
  checkPermission(PERMS.CATEGORIES_MANAGE),
  getCategories,
);
router.get("/getActiveCategories", getActiveCategories);
router.get(
  "/getCategoryById",
  validate(getCategoryByIdSchema),
  getCategoryById,
);
router.post(
  "/addCategory",
  authenticateToken,
  checkPermission(PERMS.CATEGORIES_MANAGE),
  validate(addCategorySchema),
  addCategory,
);
router.put(
  "/updateCategory",
  authenticateToken,
  checkPermission(PERMS.CATEGORIES_MANAGE),
  validate(updateCategorySchema),
  updateCategory,
);
router.put(
  "/changeCategoryActiveness",
  authenticateToken,
  checkPermission(PERMS.CATEGORIES_MANAGE),
  validate(changeCategoryActivenessSchema),
  changeCategoryActiveness,
);

//Attribute functions
router.get("/getAttributes", getActiveAttributes);
router.get(
  "/getAllAttributes",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  getAllAttributes,
);
router.post(
  "/addAttribute",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  validate(addAttributeSchema),
  addAttribute,
);
router.put(
  "/updateAttribute",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  validate(updateAttributeSchema),
  updateAttribute,
);
router.put(
  "/changeAttributeActiveness",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  validate(changeAttributeActivenessSchema),
  changeAttributeActiveness,
);

//Attribute value functions
router.get("/getAttributeValues/:attribute_id", getAttributeValues);
router.get(
  "/getAllAttributeValues/:attribute_id",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  getAllAttributeValues,
);
router.get(
  "/attributeValuesByVariantId/:variant_id",
  getAttributeValuesByVariantId,
);
router.post(
  "/addAttributeValue",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  validate(addAttributeValueSchema),
  addAttributeValue,
);
router.put(
  "/updateAttributeValue",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  validate(updateAttributeValueSchema),
  updateAttributeValue,
);
router.put(
  "/changeAttributeValueActiveness",
  authenticateToken,
  checkPermission(PERMS.ATTRIBUTES_MANAGE),
  validate(changeAttributeValueActivenessSchema),
  changeAttributeValueActiveness,
);

//Product variant functions
router.get(
  "/getProductVariants/:product_id",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  getProductVariants,
);
router.get(
  "/getActiveProductVariants",
  validate(getProductVariantsSchema),
  getActiveProductVariants,
);
router.get("/getProductVariantById", getProductVariantById);
router.post(
  "/addProductVariant",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(addProductVariantSchema),
  addProductVariant,
);
router.put(
  "/updateProductVariant",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(updateProductVariantSchema),
  updateProductVariant,
);
router.put(
  "/changeProductVariantActiveness",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  changeProductVariantActiveness,
);

//Variant attribute values
router.get(
  "/getAttributeVariants",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  getActiveAttributeVariants,
);
router.get(
  "/getAllAttributeVariants",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  getAttributeVariants,
);
router.post(
  "/addAttributeVariant",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(addAttributeVariantSchema),
  addAttributeVariant,
);

router.put(
  "/updateAttributeVariant",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(updateAttributeVariantSchema),
  updateAttributeVariant,
);
router.put(
  "/changeAttributeVariantActiveness",
  authenticateToken,
  checkPermission(PERMS.PRODUCTS_FULL_ACCESS),
  validate(changeAttributeVariantActivenessSchema),
  changeAttributeVariantActiveness,
);
export default router;
