import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders/my-orders");
      return response.data.orders;
    },
  });
}
