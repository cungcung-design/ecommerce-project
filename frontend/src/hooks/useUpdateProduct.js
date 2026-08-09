import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../services/api";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...productData }) => {
      const response = await api.put(
        `/products/${id}`,
        productData
      );

      return response.data.product;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products",
      });

      queryClient.invalidateQueries({
        queryKey: ["product", data.id],
      });
    },
  });
}
