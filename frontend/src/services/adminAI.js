import api from "./api";

export async function getAiDashboard() {
  const response = await api.get("/admin/ai/dashboard");
  return response.data;
}
