import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../services/api";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(
        `/products/${id}`
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products",
      });
    },
  });
}
