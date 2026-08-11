import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.get("/orders");
      return response.data.orders;
    },
  });
}

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

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData) => {
      const response = await api.post("/orders", orderData);
      return response.data.order;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const response = await api.post(`/orders/${orderId}/cancel`);
      return response.data.order;
    },

    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });
    },
  });
}
