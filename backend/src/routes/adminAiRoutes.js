import { Router } from "express";

import { getDashboard } from "../controllers/adminAiController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(protect, adminOnly);
router.get("/dashboard", getDashboard);

export default router;
