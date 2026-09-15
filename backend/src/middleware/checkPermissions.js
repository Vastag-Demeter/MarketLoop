import { ROLES } from "../constants/roles.js";

export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const hasPermission = req.user.permissions.includes(requiredPermission);

    if (!hasPermission) {
      return res.status(403).json({
        error: `Access denied. You need '${requiredPermission}' permission.`,
      });
    }

    next();
  };
};
