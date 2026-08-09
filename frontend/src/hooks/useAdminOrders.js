import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const response = await api.get("/admin/orders");
      return response.data.orders;
    },
  });
}
