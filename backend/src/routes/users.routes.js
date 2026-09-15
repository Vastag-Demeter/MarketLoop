import express from "express";
const router = express.Router();
import { authenticateToken } from "../middleware/auth.js";
import {
  login,
  sendNewVerificationToken,
  signup,
  verifyEmail,
  logout,
} from "../controllers/users.js";

import {
  createStaff,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/superadmin.js";
import {
  editProfile,
  getProfileData,
  disableAccount,
  activateAccount,
} from "../controllers/profile.js";

import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/addresses.js";

import {
  addPhoneNumber,
  getPhoneNumbers,
  updatePhoneNumber,
  deletePhoneNumber,
} from "../controllers/phone_numbers.js";

import {
  getCreditCards,
  updateCreditCard,
  addCreditCard,
  deleteCreditCard,
} from "../controllers/credit_card.js";

import {
  getRoles,
  getRoleById,
  addRole,
  updateRole,
  toggleRoleActiveness,
} from "../controllers/roles.js";
import { validate } from "../middleware/validate.js";
import {
  addAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from "../validators/addresses.validator.js";
import {
  addPhoneNumberSchema,
  deletePhoneNumberSchema,
  updatePhoneNumberSchema,
} from "../validators/phone_numbers.validator.js";
import {
  activateAccountSchema,
  editProfileSchema,
  loginSchema,
  sendNewTokenSchema,
  signupSchema,
  verifyEmailSchema,
} from "../validators/user.validator.js";
import {
  addRoleSchema,
  deleteRoleSchema,
  getRoleByIdSchema,
  updateRoleSchema,
} from "../validators/role.validator.js";
import {
  addCreditCardSchema,
  deleteCreditCardSchema,
  updateCreditCardSchema,
} from "../validators/creditCard.validator.js";
import {
  createStaffSchema,
  toggleUserStatusSchema,
  updateUserRoleSchema,
} from "../validators/superadmin.validator.js";
import { addUserRole, deleteUserRole } from "../controllers/user_roles.js";
import { getEmailLogById, getEmailLogs } from "../controllers/email_logs.js";
import { checkPermission } from "../middleware/checkPermissions.js";
import { PERMS } from "../constants/roles.js";
import {
  addPermissionToRole,
  deletePermissionFromRole,
  getPermissions,
} from "../controllers/permissions.js";
import { permissionRoleSchema } from "../validators/permission.validator.js";

//User functions
router.post("/login", validate(loginSchema), login);
router.post("/signup", validate(signupSchema), signup);
router.post("/verifyEmail", validate(verifyEmailSchema), verifyEmail);
router.post(
  "/sendNewToken",
  validate(sendNewTokenSchema),
  sendNewVerificationToken,
);
router.post("/logout", authenticateToken, logout);

//Profile functions
router.put(
  "/editProfile",
  authenticateToken,
  checkPermission(PERMS.PROFILE_UPDATE),
  validate(editProfileSchema),
  editProfile,
);
router.get("/getProfileData", authenticateToken, getProfileData);
router.delete(
  "/disableAccount",
  authenticateToken,
  checkPermission(PERMS.PROFILE_DEACTIVATE),
  disableAccount,
);
router.put(
  "/activateAccount",
  validate(activateAccountSchema),
  activateAccount,
);

//Address functions
router.get("/getAddress", authenticateToken, getAddresses);
router.post(
  "/addAddress",
  authenticateToken,
  validate(addAddressSchema),
  addAddress,
);
router.put(
  "/updateAddress",
  authenticateToken,
  validate(updateAddressSchema),
  updateAddress,
);
router.delete(
  "/deleteAddress",
  authenticateToken,
  validate(deleteAddressSchema),
  deleteAddress,
);

//Phone number functions
router.get(
  "/getPhoneNumbers",
  authenticateToken,
  checkPermission(PERMS.PHONE_MANAGEMENT),
  getPhoneNumbers,
);
router.post(
  "/addPhoneNumber",
  authenticateToken,
  checkPermission(PERMS.PHONE_MANAGEMENT),
  validate(addPhoneNumberSchema),
  addPhoneNumber,
);
router.put(
  "/updatePhoneNumber",
  authenticateToken,
  checkPermission(PERMS.PHONE_MANAGEMENT),
  validate(updatePhoneNumberSchema),
  updatePhoneNumber,
);
router.delete(
  "/deletePhoneNumber",
  authenticateToken,
  checkPermission(PERMS.PHONE_MANAGEMENT),
  validate(deletePhoneNumberSchema),
  deletePhoneNumber,
);

//Credit card functions
router.get("/getCreditCards", authenticateToken, getCreditCards);
router.put(
  "/updateCreditCard",
  authenticateToken,
  checkPermission(PERMS.CREDIT_CARD_MANAGEMENT),
  validate(updateCreditCardSchema),
  updateCreditCard,
);
router.post(
  "/addCreditCard",
  authenticateToken,
  checkPermission(PERMS.CREDIT_CARD_MANAGEMENT),
  validate(addCreditCardSchema),
  addCreditCard,
);
router.delete(
  "/deleteCreditCard",
  authenticateToken,
  checkPermission(PERMS.CREDIT_CARD_MANAGEMENT),
  validate(deleteCreditCardSchema),
  deleteCreditCard,
);

//Role functions
router.get(
  "/getRoles",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  getRoles,
);
router.get(
  "/getRoleById",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  validate(getRoleByIdSchema),
  getRoleById,
);
router.post(
  "/addRole",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  validate(addRoleSchema),
  addRole,
);
router.put(
  "/updateRole",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  validate(updateRoleSchema),
  updateRole,
);
router.patch(
  "/changeRoleActiveness",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  validate(deleteRoleSchema),
  toggleRoleActiveness,
);

// Superadmin functions
router.get(
  "/getusers",
  authenticateToken,
  checkPermission(PERMS.USER_MANAGEMENT),
  getAllUsers,
);
router.post(
  "/addStaff",
  authenticateToken,
  checkPermission(PERMS.USER_MANAGEMENT),
  validate(createStaffSchema),
  createStaff,
);
router.patch(
  "/toggleUserStatus",
  authenticateToken,
  checkPermission(PERMS.USER_MANAGEMENT),
  validate(toggleUserStatusSchema),
  toggleUserStatus,
);
router.post(
  "/addUserRole",
  authenticateToken,
  checkPermission(PERMS.USER_MANAGEMENT),
  validate(updateUserRoleSchema),
  addUserRole,
);

router.delete(
  "/deleteUserRole",
  authenticateToken,
  checkPermission(PERMS.USER_MANAGEMENT),
  validate(updateUserRoleSchema),
  deleteUserRole,
);

router.get(
  "/getEmailLogs",
  authenticateToken,
  checkPermission(PERMS.EMAIL_LOGS_VIEW),
  getEmailLogs,
);
router.get(
  "/getEmailLogById/:id",
  authenticateToken,
  checkPermission(PERMS.EMAIL_LOGS_VIEW),
  getEmailLogById,
);

router.get(
  "/getPermissions",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  getPermissions,
);
router.post(
  "/addPermissionRole",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  validate(permissionRoleSchema),
  addPermissionToRole,
);
router.put(
  "/removePermissionRole",
  authenticateToken,
  checkPermission(PERMS.ROLE_MANAGEMENT),
  validate(permissionRoleSchema),
  deletePermissionFromRole,
);
export default router;
