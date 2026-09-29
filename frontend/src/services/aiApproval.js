import api from "./api";

export async function approveAIAction(approvalId) {
  const response = await api.post(`/ai/approvals/${approvalId}/approve`);
  return response.data;
}

export async function rejectAIAction(approvalId) {
  const response = await api.post(`/ai/approvals/${approvalId}/reject`);
  return response.data;
}
