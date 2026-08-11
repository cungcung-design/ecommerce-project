import express from "express";

import {
  getProducts,
  getProduct,
} from "../controllers/productController.js";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  changeProductStatus,
} from "../controllers/adminProductController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  adminOnly,
} from "../middleware/adminMiddleware.js";

import {
  validate,
  productSchema,
  updateProductSchema,
} from "../middleware/validationMiddleware.js";

import {
  createAdminProductSchema,
} from "../validators/adminProductValidator.js";

const router =
  express.Router();

router.use(
  protect,
  adminOnly
);

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProduct
);

router.post(
  "/",
  validate(
    createAdminProductSchema
  ),
  createProduct
);

router.put(
  "/:id",
  validate(updateProductSchema),
  updateProduct
);

router.delete(
  "/:id",
  deleteProduct
);

router.patch(
  "/:id/status",
  changeProductStatus
);

export default router;
