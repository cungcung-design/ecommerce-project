import express from "express";

import {
  createKnowledgeDocument,
  saveKnowledgeChunks,
  searchKnowledge,
} from "../controllers/internalKnowledgeController.js";
import { internalAuth } from "../middleware/internalAuth.js";

const router = express.Router();

router.post("/knowledge/documents", internalAuth, createKnowledgeDocument);
router.post("/knowledge/chunks", internalAuth, saveKnowledgeChunks);
router.post("/knowledge/search", internalAuth, searchKnowledge);

export default router;
