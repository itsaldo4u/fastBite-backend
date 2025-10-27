import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sekret-shume-i-fshehte";

/**
 * Middleware për të verifikuar JWT token-in e dërguar nga klienti.
 * Ai kontrollon header-in Authorization dhe vendos të dhënat e përdoruesit në req.user.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token mungon ose është i pavlefshëm." });
  }

  const token = authHeader.split(" ")[1]; // Merr token-in pas 'Bearer '

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // shton { id, role } në request
    next(); // vazhdo tek route
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Token i pavlefshëm ose i skaduar." });
  }
};

/**
 * Middleware për të lejuar vetëm adminët.
 */
export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Nuk ke leje për këtë veprim (vetëm admin)." });
  }
  next();
};
