import prisma from "../lib/prisma.js";
import { cancelOrder } from "../services/orderService.js";
import {
  claimApproval,
  getPendingApproval,
} from "../services/aiApprovalService.js";

export async function approveAiAction(req, res) {
  try {
    const approval = await getPendingApproval({
      approvalId: req.params.id,
      userId: req.user.id,
    });

    if (approval.toolName !== "cancel_order") {
      return res.status(400).json({
        success: false,
        message: "Unsupported approval action.",
      });
    }

    const claimed = await claimApproval({
      approvalId: approval.id,
      userId: req.user.id,
      status: "APPROVED",
      timestampField: "approvedAt",
    });

    if (!claimed) {
      return res.status(400).json({
        success: false,
        message: "Approval not found.",
      });
    }

    try {
      const result = await cancelOrder(
        req.user.id,
        approval.arguments.order_id
      );

      return res.json({
        success: true,
        result,
      });
    } catch (error) {
      await prisma.aiApproval.updateMany({
        where: {
          id: approval.id,
          userId: req.user.id,
          status: "APPROVED",
        },
        data: {
          status: "PENDING",
          approvedAt: null,
        },
      });

      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function rejectAiAction(req, res) {
  try {
    await getPendingApproval({
      approvalId: req.params.id,
      userId: req.user.id,
    });

    const claimed = await claimApproval({
      approvalId: req.params.id,
      userId: req.user.id,
      status: "REJECTED",
      timestampField: "rejectedAt",
    });

    if (!claimed) {
      return res.status(400).json({
        success: false,
        message: "Approval not found.",
      });
    }

    return res.json({
      success: true,
      status: "rejected",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
