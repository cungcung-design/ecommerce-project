import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useAdminOrder(id) {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: async () => {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data.order;
    },
    enabled: Boolean(id),
  });
}
