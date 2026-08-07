import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const authverification = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError("Access token is required", 401, "UNAUTHORIZED")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired access token", 401, "JWT_ERROR")
    );
  }
};




export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("Unauthorized", 401, "UNAUTHORIZED")
      );
    }
    
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("Forbidden", 403, "FORBIDDEN")
      );
    }

    next();
  };
};