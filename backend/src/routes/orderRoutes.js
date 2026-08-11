import express from "express";

import {
  storeOrder,
  listMyOrders,
  showMyOrder,
  cancelMyOrder,
  showMyOrderPayment,
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

router.get("/:id/payment", showMyOrderPayment);

router.post("/", validate(shippingSchema), storeOrder);

router.post("/:id/cancel", cancelMyOrder);

export default router;
