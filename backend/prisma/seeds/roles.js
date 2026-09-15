import { PERMS, ROLES } from "../../src/constants/roles.js";
export async function seedRoles(prisma) {
  const permissionEntries = [];
  console.log(ROLES);
  for (const key of Object.values(PERMS)) {
    const p = await prisma.permissions.upsert({
      where: { key: key },
      update: {},
      create: {
        key: key,
        name: key.replace("_", " ").toLowerCase(),
      },
    });
    permissionEntries.push(p);
  }
  console.log(`Seeded ${permissionEntries.length} permissions.`);

  const roleMap = {};
  for (const roleKey of Object.values(ROLES)) {
    const role = await prisma.roles.upsert({
      where: { key: roleKey },
      update: {},
      create: {
        key: roleKey,

        name: roleKey.charAt(0) + roleKey.slice(1).toLowerCase(),
        is_active: true,
      },
    });

    roleMap[roleKey] = role;
  }
  console.log("Seeded roles.");
}
