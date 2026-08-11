import express from "express";

import {
  storeOrder,
  listMyOrders,
  showMyOrder,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import {
  validate,
  shippingSchema,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", listMyOrders);

router.get("/:id", showMyOrder);

router.post("/", validate(shippingSchema), storeOrder);

export default router;
