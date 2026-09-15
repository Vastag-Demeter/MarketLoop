import express from "express";
import { checkPermission } from "../middleware/checkPermissions.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import {
  createSupportTicket,
  getSupportTicketById,
  getSupportTicketByToken,
  getSupportTickets,
  replyToTicket,
  replyToTicketByCustomer,
  toggleTicketStatus,
} from "../controllers/support.js";
import {
  createTicketSchema,
  replyTicketByCustomerSchema,
  replyTicketSchema,
  toggleSupportTicketStatusSchema,
} from "../validators/support.validator.js";
import { validate } from "../middleware/validate.js";
import { authenticateToken } from "../middleware/auth.js";
import { PERMS } from "../constants/roles.js";
const router = express.Router();

router.post(
  "/createSupportTicket",
  optionalAuth,
  validate(createTicketSchema),
  createSupportTicket,
);

router.get(
  "/getSupportTickets",
  authenticateToken,
  checkPermission(PERMS.TICKET_VIEW),
  getSupportTickets,
);

router.get(
  "/getSupportTicketById/:id",
  authenticateToken,
  checkPermission(PERMS.TICKET_VIEW),
  getSupportTicketById,
);

router.post(
  "/replyToTicket",
  authenticateToken,
  checkPermission(PERMS.TICKET_REPLY),
  validate(replyTicketSchema),
  replyToTicket,
);
router.get("/getSupportTicketByToken/:token", getSupportTicketByToken);
router.post(
  "/replyToTicketByCustomer",
  validate(replyTicketByCustomerSchema),
  replyToTicketByCustomer,
);
router.patch(
  "/toggleSupportTicketStatus",
  authenticateToken,
  checkPermission(PERMS.TICKET_STATUS_MANAGE),
  validate(toggleSupportTicketStatusSchema),
  toggleTicketStatus,
);
export default router;
