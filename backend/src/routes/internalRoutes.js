import express from "express";

import {
  getEmbeddingSources,
  getInternalInventory,
  getInternalProduct,
  internalProductSearch,
  semanticProductSearch,
  upsertProductEmbeddings,
} from "../controllers/internalController.js";
import {
  cancelInternalOrder,
  createInternalSupportTicket,
  getInternalOrderItems,
  getInternalOrderStatus,
} from "../controllers/internalOrderController.js";
import { createAiApproval } from "../controllers/internalApprovalController.js";
import { internalAuth } from "../middleware/internalAuth.js";

const router = express.Router();

router.get("/products/search", internalAuth, internalProductSearch);
router.get("/products/embedding-source", internalAuth, getEmbeddingSources);
router.get("/products/:id/inventory", internalAuth, getInternalInventory);
router.get("/products/:id", internalAuth, getInternalProduct);
router.post("/products/embeddings", internalAuth, upsertProductEmbeddings);
router.post("/products/semantic-search", internalAuth, semanticProductSearch);
router.get("/orders/:id/status", internalAuth, getInternalOrderStatus);
router.get("/orders/:id/items", internalAuth, getInternalOrderItems);
router.post("/orders/:id/cancel", internalAuth, cancelInternalOrder);
router.post("/support/tickets", internalAuth, createInternalSupportTicket);
router.post("/ai/approvals", internalAuth, createAiApproval);

export default router;
