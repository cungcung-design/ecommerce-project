import express from "express";

import {
  getCategories,
  createCategory,
} from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { categorySchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/", protect, adminOnly, validate(categorySchema), createCategory);

export default router;