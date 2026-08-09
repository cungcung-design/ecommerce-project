import express from "express";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { productSchema } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post("/", protect, adminOnly, validate(productSchema), createProduct);

router.put("/:id", protect, adminOnly, validate(productSchema), updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;