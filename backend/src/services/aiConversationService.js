import prisma from "../lib/prisma.js";

async function requireOwnedConversation(userId, conversationId) {
  const conversation = await prisma.aiConversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    const error = new Error("Conversation not found.");
    error.statusCode = 404;
    throw error;
  }

  return conversation;
}

export async function createConversation(userId) {
  return prisma.aiConversation.create({
    data: { userId },
  });
}

export async function getConversations(userId) {
  return prisma.aiConversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getConversation(userId, conversationId) {
  return prisma.aiConversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function renameConversation(userId, conversationId, title) {
  const result = await prisma.aiConversation.updateMany({
    where: {
      id: conversationId,
      userId,
    },
    data: { title },
  });

  return result.count;
}

export async function deleteConversation(userId, conversationId) {
  const result = await prisma.aiConversation.deleteMany({
    where: {
      id: conversationId,
      userId,
    },
  });

  return result.count;
}

export async function getRecentMessages(userId, conversationId, limit = 12) {
  const conversation = await requireOwnedConversation(userId, conversationId);

  const messages = await prisma.aiMessage.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      role: true,
      content: true,
    },
  });

  return messages.reverse();
}

export async function addMessage(userId, conversationId, { role, content, metadata, title }) {
  const conversation = await requireOwnedConversation(userId, conversationId);

  return prisma.$transaction(async (tx) => {
    const message = await tx.aiMessage.create({
      data: {
        conversationId,
        role,
        content,
        ...(metadata ? { metadata } : {}),
      },
    });

    await tx.aiConversation.update({
      where: { id: conversationId },
      data: {
        ...(title && !conversation.title ? { title } : {}),
        updatedAt: new Date(),
      },
    });

    return message;
  });
}
