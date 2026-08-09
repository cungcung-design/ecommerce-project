import express from "express";

import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getOrderById,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/dashboard", getDashboardStats);

router.get("/orders", getAllOrders);

router.get("/orders/:id", getOrderById);

router.patch("/orders/:id/status", updateOrderStatus);

router.get("/customers", getAllCustomers);

export default router;
