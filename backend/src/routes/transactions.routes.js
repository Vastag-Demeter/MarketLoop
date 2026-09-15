import express from "express";
import { validate } from "../middleware/validate.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllPaymentMethods,
  getPaymentMethods,
  getPaymentMethodById,
  addPaymentMethod,
  updatePaymentMethod,
  changePaymentMethodActiveness,
} from "../controllers/payment_methods.js";

import {
  getCartItems,
  getCartItemById,
  addCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cart_items.js";

import {
  getCart,
  createCart,
  updateCart,
  deleteCart,
} from "../controllers/carts.js";
import {
  addCartItemSchema,
  getCartItemByIdSchema,
  getCartItemsSchema,
  updateCartItemSchema,
} from "../validators/cartItem.validator.js";
import {
  addPaymentMethodSchema,
  changePaymentMethodActivenessSchema,
  getPaymentMethodByIdSchema,
  updatePaymentMethodSchema,
} from "../validators/paymentMethod.validator.js";
import {
  createCartSchema,
  deleteCartSchema,
  updateCartSchema,
} from "../validators/cart.validator.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import { PERMS } from "../constants/roles.js";

const router = express.Router();

//Payment method functions
router.get("/getPaymentMethods", getPaymentMethods);
router.get(
  "/getAllPaymentMethods",
  authenticateToken,
  checkPermission(PERMS.PAYMENT_METHODS_MANAGE),
  getAllPaymentMethods,
);
router.get(
  "/get/getPaymentMethodById",
  validate(getPaymentMethodByIdSchema),
  getPaymentMethodById,
);
router.post(
  "/addPaymentMethod",
  authenticateToken,
  checkPermission(PERMS.PAYMENT_METHODS_MANAGE),
  validate(addPaymentMethodSchema),
  addPaymentMethod,
);
router.put(
  "/updatePaymentMethod",
  authenticateToken,
  checkPermission(PERMS.PAYMENT_METHODS_MANAGE),
  validate(updatePaymentMethodSchema),
  updatePaymentMethod,
);
router.put(
  "/changePaymentMethodActiveness",
  authenticateToken,
  checkPermission(PERMS.PAYMENT_METHODS_MANAGE),
  validate(changePaymentMethodActivenessSchema),
  changePaymentMethodActiveness,
);

//Cart item functions
router.get("/getCartItems", validate(getCartItemsSchema), getCartItems);
router.get(
  "/getCartItemById",
  validate(getCartItemByIdSchema),
  getCartItemById,
);
router.post("/addCartItem", validate(addCartItemSchema), addCartItem);
router.put(
  "/updateCartItem",
  optionalAuth,
  validate(updateCartItemSchema),
  updateCartItem,
);
router.delete("/deleteCartItem/:id", optionalAuth, deleteCartItem);

//Cart functions
router.get("/getCart/:session_token", optionalAuth, getCart);
router.post("/createCart/", validate(createCartSchema), createCart);
router.put(
  "/updateCart",
  authenticateToken,
  checkPermission(PERMS.CART_MANAGE),
  validate(updateCartSchema),
  updateCart,
);
router.delete("/deleteCart", validate(deleteCartSchema), deleteCart);

export default router;
