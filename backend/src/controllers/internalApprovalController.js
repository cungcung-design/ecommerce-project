import { createApproval } from "../services/aiApprovalService.js";

export async function createAiApproval(req, res) {
  try {
    const userId = Number(req.body.userId);
    const toolName = req.body.toolName;
    const toolArguments = req.body.arguments;

    if (
      !Number.isInteger(userId) ||
      toolName !== "cancel_order" ||
      !toolArguments ||
      typeof toolArguments !== "object" ||
      !Number.isInteger(Number(toolArguments.order_id))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval request.",
      });
    }

    const approval = await createApproval({
      userId,
      toolName,
      arguments: {
        order_id: Number(toolArguments.order_id),
      },
    });

    return res.status(201).json({
      success: true,
      id: approval.id,
      status: approval.status,
      tool: approval.toolName,
      arguments: approval.arguments,
      expiresAt: approval.expiresAt,
    });
  } catch (error) {
    console.error("Create AI approval error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create approval.",
    });
  }
}
