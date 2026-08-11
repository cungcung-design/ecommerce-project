import express from "express";

import {
  showCart,
  addItem,
  updateItem,
  removeItem,
  emptyCart,
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  validate,
  cartItemSchema,
  updateCartItemSchema,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", showCart);

router.post("/items", validate(cartItemSchema), addItem);

router.put(
  "/items/:productId",
  validate(updateCartItemSchema),
  updateItem
);

router.delete("/items/:productId", removeItem);

router.delete("/", emptyCart);

export default router;
