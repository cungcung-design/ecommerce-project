import express from "express";

import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController.js";

import { validate } from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/me", protect, getMe);

router.post("/logout", protect, logout);

export default router;