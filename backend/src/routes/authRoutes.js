import express from "express";

import {
  register,
  login,
  googleLogin,
  getMe,
  logout,
} from "../controllers/authController.js";

import { validate } from "../middleware/validationMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema, googleAuthSchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.post("/google", validate(googleAuthSchema), googleLogin);

router.get("/me", protect, getMe);

router.post("/logout", protect, logout);

export default router;