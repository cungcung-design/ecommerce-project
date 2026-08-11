import express from "express";

import {
  getDashboardStats,
  getAllCustomers,
} from "../controllers/adminDashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/dashboard", getDashboardStats);

router.get("/customers", getAllCustomers);

export default router;
