import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useAdminOrders(params = {}) {
  return useQuery({
    queryKey: ["admin", "orders", params],

    queryFn: async () => {
      const response = await api.get("/admin/orders", {
        params,
      });

      return response.data;
    },
  });
}
