import jwt from "jsonwebtoken";
export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ error: "Missing token, access denied." });

  jwt.verify(token, process.env.JWT_PASS, (err, user) => {
    if (err) {
      res.clearCookie("token");
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    req.user = user;
    next();
  });
};
