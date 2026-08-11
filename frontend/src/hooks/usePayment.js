import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export function useOrderPayment(orderId, options = {}) {
  return useQuery({
    queryKey: ["order", orderId, "payment"],
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}/payment`);
      return response.data.payment;
    },
    enabled: Boolean(orderId),
    staleTime: 15000,
    ...options,
  });
}

export function useCreatePaymentSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId) => {
      const response = await api.post("/payments/create", {
        orderId,
      });
      return response.data;
    },

    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({
        queryKey: ["order", orderId, "payment"],
      });
    },
  });
}
