import express from "express";

import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  getAdminCategory,
  updateAdminCategory,
  updateAdminCategoryStatus,
} from "../controllers/adminCategoryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { categorySchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/", getAdminCategories);
router.get("/:id", getAdminCategory);
router.post("/", validate(categorySchema), createAdminCategory);
router.put("/:id", validate(categorySchema), updateAdminCategory);
router.patch("/:id/status", updateAdminCategoryStatus);
router.delete("/:id", deleteAdminCategory);

export default router;
