import express from "express";

import {
  listUsers,
  showUser,
  changeUserRole,
  changeUserStatus,
} from "../controllers/adminUserController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import {
  updateUserRoleSchema,
  updateUserStatusSchema,
} from "../validators/adminUserValidator.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/", listUsers);

router.get("/:id", showUser);

router.patch(
  "/:id/role",
  validate(updateUserRoleSchema),
  changeUserRole
);

router.patch(
  "/:id/status",
  validate(updateUserStatusSchema),
  changeUserStatus
);

export default router;
