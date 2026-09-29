import api from "./api";

async function request(path, options = {}) {
  const response = await api.request({
    url: path,
    ...options,
  });

  return response.data;
}

export function getConversations() {
  return request("/ai/conversations");
}

export function createConversation() {
  return request("/ai/conversations", { method: "POST" });
}

export function getConversation(id) {
  return request(`/ai/conversations/${id}`);
}

export function renameConversation(id, title) {
  return request(`/ai/conversations/${id}`, {
    method: "PATCH",
    data: { title },
  });
}

export function deleteConversation(id) {
  return request(`/ai/conversations/${id}`, { method: "DELETE" });
}
