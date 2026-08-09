import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../services/api";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await api.patch(
        `/admin/orders/${id}/status`,
        { status }
      );

      return response.data.order;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["admin", "order", variables.id],
      });
    },
  });
}
