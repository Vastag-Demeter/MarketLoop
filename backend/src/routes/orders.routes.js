import express from "express";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { PERMS } from "../constants/roles.js";
import { authenticateToken } from "../middleware/auth.js";
import {
  getOrders,
  getMyOrders,
  getOrderById,
  getOrderByNumber,
  addOrder,
  changeOrderStatus,
  cancelOrder,
} from "../controllers/orders.js";
import { validate } from "../middleware/validate.js";

import {
  addOrderSchema,
  changeOrderStatusSchema,
} from "../validators/order.validator.js";
import { checkPermission } from "../middleware/checkPermissions.js";

const router = express.Router();

// Order functions
router.get(
  "/myOrders",
  authenticateToken,
  checkPermission(PERMS.ORDERS_VIEW),
  getMyOrders,
);
router.get("/order/:order_number", optionalAuth, getOrderByNumber);
router.get(
  "/getOrders",
  authenticateToken,
  checkPermission(PERMS.ORDERS_MANAGE),
  getOrders,
);
router.get(
  "/getOrderById/:id",
  authenticateToken,
  checkPermission(PERMS.ORDERS_MANAGE),
  getOrderById,
);
router.post("/addOrder", optionalAuth, validate(addOrderSchema), addOrder);
router.put(
  "/changeOrderStatus",
  authenticateToken,
  checkPermission(PERMS.ORDERS_MANAGE),
  validate(changeOrderStatusSchema),
  changeOrderStatus,
);
router.delete("/cancelOrder/:token/:number", cancelOrder);
export default router;
