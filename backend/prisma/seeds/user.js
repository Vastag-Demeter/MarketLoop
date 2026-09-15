import { PERMS, ROLES } from "../../src/constants/roles.js";
import bcrypt from "bcryptjs";
const saltRounds = 10;
import prisma from "../../src/constants/db.js";
export const seedUser = async () => {
  console.log("--- Starting seeding users and assigning roles ---");

  const dbRoles = await prisma.roles.findMany();
  const roleMap = {};
  dbRoles.forEach((r) => {
    roleMap[r.key] = r.id;
  });

  const createSecureUser = async (email, firstName, lastName, envPass) => {
    return await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: await bcrypt.hash(envPass || "DefaultPass123!", saltRounds),
        active: true,
      },
    });
  };

  const assignRole = async (userId, roleKey) => {
    const roleId = roleMap[roleKey];
    if (!roleId) return;
    await prisma.userRoles.upsert({
      where: { user_id_role_id: { user_id: userId, role_id: roleId } },
      update: {},
      create: { user_id: userId, role_id: roleId },
    });
  };

  const superAdmin = await createSecureUser(
    "superadmin@webshop.hu",
    "Super",
    "Admin",
    process.env.SUPERADMIN_PASSWORD,
  );
  const admin = await createSecureUser(
    "admin@webshop.hu",
    "Admin",
    "User",
    process.env.ADMIN_PASSWORD,
  );
  const helpDesk = await createSecureUser(
    "helpdesk@webshop.hu",
    "Help",
    "Desk",
    process.env.HELPDESK_PASSWORD,
  );
  const worker = await createSecureUser(
    "worker@webshop.hu",
    "Worker",
    "Joe",
    process.env.WORKER_PASSWORD,
  );
  const customer = await createSecureUser(
    "customer@webshop.hu",
    "Customer",
    "Armando",
    process.env.CUSTOMER_PASSWORD,
  );

  await assignRole(superAdmin.id, ROLES.SUPERADMIN);
  await assignRole(admin.id, ROLES.ADMIN);
  await assignRole(helpDesk.id, ROLES.HELPDESK);
  await assignRole(worker.id, ROLES.WORKER);
  await assignRole(customer.id, ROLES.CUSTOMER);

  console.log("--- Assigning specific permissions to ADMIN role ---");

  const assignPermissionToRule = async (roleName, permissionName) => {
    try {
      const role = await prisma.roles.findUnique({
        where: {
          key: roleName,
        },
      });
      const permission = await prisma.permissions.findUnique({
        where: {
          key: permissionName,
        },
      });
      if (!role || !permission) return;
      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
        update: {},
        create: {
          role_id: role.id,
          permission_id: permission.id,
        },
      });
    } catch (error) {
      console.error(error);
      return;
    }
  };

  //Adding permissions to ADMIN rule
  const adminPermissionsKeys = [
    PERMS.PROFILE_UPDATE,
    PERMS.PRODUCTS_FULL_ACCESS,
    PERMS.CATEGORIES_MANAGE,
    PERMS.ATTRIBUTES_MANAGE,
    PERMS.VENDORS_MANAGE,
    PERMS.PAYMENT_METHODS_MANAGE,
  ];
  for (const pKey of adminPermissionsKeys) {
    await assignPermissionToRule(ROLES.ADMIN, pKey);
  }

  //SUPERADMIN permissions
  const superAdminPermssionKeys = [
    PERMS.PROFILE_UPDATE,
    PERMS.USER_MANAGEMENT,
    PERMS.ROLE_MANAGEMENT,
    PERMS.SYSTEM_CONFIG,
    PERMS.EMAIL_LOGS_VIEW,
    PERMS.EMAIL_TYPES_MANAGEMENT,
    PERMS.VENDORS_MANAGE,
    PERMS.TICKET_STATUS_MANAGE,
  ];

  for (const pKey of superAdminPermssionKeys)
    await assignPermissionToRule(ROLES.SUPERADMIN, pKey);

  //HELPDESK permissions
  const helpdeskPermissionKeys = [
    PERMS.PROFILE_UPDATE,
    PERMS.TICKET_VIEW,
    PERMS.TICKET_DELETE,
    PERMS.TICKET_REPLY,
    PERMS.TICKET_STATUS_MANAGE,
  ];
  for (const key of helpdeskPermissionKeys)
    await assignPermissionToRule(ROLES.HELPDESK, key);

  //WORKER permissions
  const workerPermissionKeys = [
    PERMS.PROFILE_UPDATE,
    PERMS.ORDERS_VIEW,
    PERMS.ORDER_STATUS_MANAGE,
    PERMS.ORDERS_MANAGE,
  ];
  for (const key of workerPermissionKeys)
    await assignPermissionToRule(ROLES.WORKER, key);

  //CUSTOMER permissions
  const customerPermissionKeys = [
    PERMS.PROFILE_UPDATE,
    PERMS.PROFILE_DEACTIVATE,
    PERMS.PROFILE_ACTIVATE,
    PERMS.CART_MANAGE,
    PERMS.ORDERS_VIEW,
    PERMS.PHONE_MANAGEMENT,
    PERMS.ADDRESS_MANAGEMENT,
    PERMS.CREDIT_CARD_MANAGEMENT,
  ];

  for (const key of customerPermissionKeys)
    await assignPermissionToRule(ROLES.CUSTOMER, key);
  console.log("--- User seeding and role assignment finished ---");
};
