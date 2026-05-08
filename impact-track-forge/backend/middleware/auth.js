import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Authorization header missing" });

  const token = header.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set");
    const payload = jwt.verify(token, secret);
    req.userId = payload.id;
    req.userEmail = payload.email;
    req.userRole = payload.role || "volunteer";
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
