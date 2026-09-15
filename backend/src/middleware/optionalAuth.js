import jwt from "jsonwebtoken";

export const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PASS);
    console.log("DECODED: ", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Optional Auth - Invalid token:", error.message);
    next();
  }
};
