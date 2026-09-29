import prisma from "../lib/prisma.js";

const DAY = 24 * 60 * 60 * 1000;

export async function getDashboard(req, res, next) {
  try {
    const since = new Date(Date.now() - DAY);
    const recentWhere = { createdAt: { gte: since } };

    const [
      totalRequests,
      successRequests,
      errorRequests,
      approvalRequests,
      blockedRequests,
      rejectedApprovals,
      expiredApprovals,
      latency,
      tokens,
      agents,
      tools,
      activity,
      latestEvaluation,
    ] = await Promise.all([
      prisma.aiRequestLog.count({ where: recentWhere }),
      prisma.aiRequestLog.count({ where: { ...recentWhere, status: "SUCCESS" } }),
      prisma.aiRequestLog.count({ where: { ...recentWhere, status: "ERROR" } }),
      prisma.aiRequestLog.count({ where: { ...recentWhere, status: "APPROVAL_REQUIRED" } }),
      prisma.aiRequestLog.count({ where: { ...recentWhere, status: "BLOCKED" } }),
      prisma.aiApproval.count({ where: { ...recentWhere, status: "REJECTED" } }),
      prisma.aiApproval.count({ where: { ...recentWhere, status: "EXPIRED" } }),
      prisma.aiRequestLog.aggregate({
        where: { ...recentWhere, latencyMs: { not: null } },
        _avg: { latencyMs: true },
      }),
      prisma.aiRequestLog.aggregate({
        where: recentWhere,
        _sum: {
          inputTokens: true,
          outputTokens: true,
          totalTokens: true,
        },
      }),
      prisma.aiRequestLog.groupBy({
        by: ["agent"],
        where: { ...recentWhere, agent: { not: null } },
        _count: { agent: true },
      }),
      prisma.aiRequestLog.groupBy({
        by: ["tool"],
        where: { ...recentWhere, tool: { not: null } },
        _count: { tool: true },
      }),
      prisma.aiRequestLog.findMany({
        where: recentWhere,
        orderBy: { createdAt: "desc" },
        take: 12,
        select: {
          id: true,
          agent: true,
          tool: true,
          status: true,
          latencyMs: true,
          createdAt: true,
        },
      }),
      prisma.aiEvaluationRun.findFirst({
        orderBy: { createdAt: "desc" },
        include: {
          cases: {
            select: {
              agentCorrect: true,
              toolCorrect: true,
              answerScore: true,
            },
          },
        },
      }),
    ]);

    const cases = latestEvaluation?.cases || [];
    const scored = cases.filter((item) => item.answerScore != null);
    const evaluation = cases.length
      ? {
          createdAt: latestEvaluation.createdAt,
          agentRoutingAccuracy: cases.filter((item) => item.agentCorrect).length / cases.length,
          toolSelectionAccuracy: cases.filter((item) => item.toolCorrect).length / cases.length,
          answerScore: scored.length
            ? scored.reduce((sum, item) => sum + item.answerScore, 0) / scored.length
            : null,
        }
      : null;

    res.json({
      success: true,
      data: {
        totalRequests,
        successRequests,
        errorRequests,
        approvalRequests,
        blockedRequests,
        rejectedApprovals,
        expiredApprovals,
        averageLatencyMs: latency._avg.latencyMs || 0,
        tokens: {
          input: tokens._sum.inputTokens || 0,
          output: tokens._sum.outputTokens || 0,
          total: tokens._sum.totalTokens || 0,
        },
        agents: agents
          .map((item) => ({ agent: item.agent, count: item._count.agent }))
          .sort((left, right) => right.count - left.count),
        tools: tools
          .map((item) => ({ tool: item.tool, count: item._count.tool }))
          .sort((left, right) => right.count - left.count),
        activity,
        evaluation,
      },
    });
  } catch (error) {
    next(error);
  }
}
