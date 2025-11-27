import jwt from "jsonwebtoken";
import process from "process";

export function authMiddleware(req, res, next) {
  const bearer = req.headers?.authorization ?? "";
  const prefix = "Bearer ";

  if (!bearer.startsWith(prefix)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = bearer.substring(prefix.length);

  try {
    const payload = jwt.verify(token, process.env.APP_SECRET);

    req.jwtPayload = payload;

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      result: err.message,
    });
  }
}

export function adminOnly(req, res, next) {
  if (req.jwtPayload.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Akses khusus admin",
    });
  }

  next();
}
