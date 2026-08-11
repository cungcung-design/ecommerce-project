import express from "express";

import {
  getAdminDashboardController,
} from "../controllers/adminDashboardController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import {
  adminOnly,
} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.use(
  protect,
  adminOnly
);

router.get(
  "/",
  getAdminDashboardController
);

export default router;
