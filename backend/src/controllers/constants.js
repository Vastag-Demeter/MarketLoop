import { PERMS, ROLES } from "../constants/roles.js";
export const getSystemConstants = async (req, res) => {
  try {
    res.status(200).json({ data: { permissions: PERMS, roles: ROLES } });
  } catch (error) {
    res.status(500).json({ error: "Could not load system constants" });
  }
};
