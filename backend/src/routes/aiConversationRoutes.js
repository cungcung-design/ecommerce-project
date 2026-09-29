import { Router } from "express";

import {
  create,
  get,
  list,
  remove,
  rename,
} from "../controllers/aiConversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/", create);
router.get("/", list);
router.get("/:id", get);
router.patch("/:id", rename);
router.delete("/:id", remove);

export default router;
