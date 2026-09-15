import express from "express";
import {
  getEmailTypes,
  getEmailTypeById,
  addEmailType,
  updateEmailType,
  toggleEmailTypeActiveness,
  getAllEmailTypes,
} from "../controllers/email_types.js";
import {
  getOrderStatuses,
  getOrderStatusById,
  addOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
  changeFinalOrderStatus,
} from "../controllers/order_statuses.js";

import {
  getSupportTicketStatuses,
  getSupportTicketStatusById,
  addSupportTicketStatus,
  updateSupportTicketStatus,
  toggleSupportTicketStatus,
  getAllSupportTicketStatuses,
} from "../controllers/support_ticket_statuses.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import {
  addSupportTicketStatusSchema,
  deleteSupportTicketStatusSchema,
  getSupportTicketStatusByIdSchema,
  updateSupportTicketStatusSchema,
} from "../validators/ticketStatus.validator.js";
import {
  addOrderStatusSchema,
  changeFinalOrderStatusSchema,
  deleteOrderStatusSchema,
  getOrderStatusByIdSchema,
  updateOrderStatusSchema,
} from "../validators/orderStatuses.validator.js";
import {
  addEmailTypeSchema,
  deleteEmailTypeSchema,
  getEmailTypeByIdSchema,
  updateEmailTypeSchema,
} from "../validators/emailTypes.validator.js";
import { PERMS } from "../constants/roles.js";
import { getSystemConstants } from "../controllers/constants.js";

const router = express.Router();

//Email type functions
router.get(
  "/getEmailTypes",
  authenticateToken,
  checkPermission(PERMS.EMAIL_TYPES_MANAGEMENT),
  getEmailTypes,
);
router.get(
  "/getAllEmailTypes",
  authenticateToken,
  checkPermission(PERMS.EMAIL_TYPES_MANAGEMENT),
  getAllEmailTypes,
);
router.get(
  "/getEmailTypeById",
  authenticateToken,
  checkPermission(PERMS.EMAIL_TYPES_MANAGEMENT),
  validate(getEmailTypeByIdSchema),
  getEmailTypeById,
);
router.post(
  "/addEmailType",
  authenticateToken,
  checkPermission(PERMS.EMAIL_TYPES_MANAGEMENT),
  validate(addEmailTypeSchema),
  addEmailType,
);
router.put(
  "/updateEmailType",
  authenticateToken,
  checkPermission(PERMS.EMAIL_TYPES_MANAGEMENT),
  validate(updateEmailTypeSchema),
  updateEmailType,
);
router.patch(
  "/toggleEmailType",
  authenticateToken,
  checkPermission(PERMS.EMAIL_TYPES_MANAGEMENT),
  validate(deleteEmailTypeSchema),
  toggleEmailTypeActiveness,
);

//Order status functions
router.get("/getOrderStatuses", authenticateToken, getOrderStatuses);
router.get(
  "/getOrderStatusById",
  authenticateToken,
  validate(getOrderStatusByIdSchema),
  getOrderStatusById,
);
router.post(
  "/addOrderStatus",
  authenticateToken,
  checkPermission(PERMS.ORDER_STATUS_MANAGE),
  validate(addOrderStatusSchema),
  addOrderStatus,
);
router.put(
  "/updateOrderStatus",
  authenticateToken,
  checkPermission(PERMS.ORDER_STATUS_MANAGE),
  validate(updateOrderStatusSchema),
  updateOrderStatus,
);
router.put(
  "/changeFinalOrderStatus",
  authenticateToken,
  checkPermission(PERMS.ORDER_STATUS_MANAGE),
  validate(changeFinalOrderStatusSchema),
  changeFinalOrderStatus,
);
router.delete(
  "/deleteOrderStatus",
  authenticateToken,
  checkPermission(PERMS.ORDER_STATUS_MANAGE),
  validate(deleteOrderStatusSchema),
  deleteOrderStatus,
);

//Support ticket status functions
router.get(
  "/getSupportTicketStatuses",
  authenticateToken,
  getSupportTicketStatuses,
);
router.get(
  "/getSupportTicketStatusById",
  authenticateToken,
  checkPermission(PERMS.TICKET_STATUS_MANAGE),
  validate(getSupportTicketStatusByIdSchema),
  getSupportTicketStatusById,
);
router.get(
  "/getAllSupportTicketStatuses",
  authenticateToken,
  checkPermission(PERMS.TICKET_STATUS_MANAGE),
  getAllSupportTicketStatuses,
);
router.post(
  "/addSupportTicketStatus",
  authenticateToken,
  checkPermission(PERMS.TICKET_STATUS_MANAGE),
  validate(addSupportTicketStatusSchema),
  addSupportTicketStatus,
);
router.put(
  "/updateSupportTicketStatus",
  authenticateToken,
  checkPermission(PERMS.TICKET_STATUS_MANAGE),
  validate(updateSupportTicketStatusSchema),
  updateSupportTicketStatus,
);
router.patch(
  "/toggleSupportTicketStatus",
  authenticateToken,
  checkPermission(PERMS.TICKET_STATUS_MANAGE),
  validate(deleteSupportTicketStatusSchema),
  toggleSupportTicketStatus,
);

router.get("/config", getSystemConstants);
export default router;
