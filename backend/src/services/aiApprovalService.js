import prisma from "../lib/prisma.js";

const FIVE_MINUTES = 5 * 60 * 1000;

export async function createApproval({ userId, toolName, arguments: toolArguments }) {
  return prisma.aiApproval.create({
    data: {
      userId,
      toolName,
      arguments: toolArguments,
      expiresAt: new Date(Date.now() + FIVE_MINUTES),
    },
  });
}

export async function getPendingApproval({ approvalId, userId }) {
  const approval = await prisma.aiApproval.findFirst({
    where: {
      id: approvalId,
      userId,
      status: "PENDING",
    },
  });

  if (!approval) {
    throw new Error("Approval not found.");
  }

  if (approval.expiresAt < new Date()) {
    await prisma.aiApproval.update({
      where: { id: approval.id },
      data: { status: "EXPIRED" },
    });

    throw new Error("Approval has expired.");
  }

  return approval;
}

export async function claimApproval({ approvalId, userId, status, timestampField }) {
  const result = await prisma.aiApproval.updateMany({
    where: {
      id: approvalId,
      userId,
      status: "PENDING",
      expiresAt: { gt: new Date() },
    },
    data: {
      status,
      [timestampField]: new Date(),
    },
  });

  return result.count === 1;
}
