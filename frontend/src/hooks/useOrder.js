import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useOrder(id) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);
      return response.data.order;
    },
    enabled: Boolean(id),
  });
}
