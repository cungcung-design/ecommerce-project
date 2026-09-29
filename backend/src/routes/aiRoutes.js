import express from "express";

import { supportController } from "../controllers/aiController.js";
import {
  approveAiAction,
  rejectAiAction,
} from "../controllers/aiApprovalController.js";
import { streamAIChat } from "../controllers/aiStreamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/support", protect, supportController);
router.post("/chat/stream", protect, streamAIChat);
router.post("/approvals/:id/approve", protect, approveAiAction);
router.post("/approvals/:id/reject", protect, rejectAiAction);

export default router;
