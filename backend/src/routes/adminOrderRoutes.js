import express from "express";

import {
  listAllOrders,
  showAdminOrder,
  changeOrderStatus,
} from "../controllers/adminOrderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { updateOrderStatusSchema } from "../validators/orderValidator.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/", listAllOrders);

router.get("/:id", showAdminOrder);

router.patch(
  "/:id/status",
  validate(updateOrderStatusSchema),
  changeOrderStatus
);

export default router;
