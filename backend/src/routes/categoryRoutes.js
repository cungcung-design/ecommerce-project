import express from "express";

import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { categorySchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/", getCategories);

router.get("/:id", getCategory);

router.post("/", protect, adminOnly, validate(categorySchema), createCategory);

router.put("/:id", protect, adminOnly, validate(categorySchema), updateCategory);

router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;