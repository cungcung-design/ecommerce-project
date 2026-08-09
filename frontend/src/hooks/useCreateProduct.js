import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData) => {
      const response = await api.post(
        "/products",
        productData
      );

      return response.data.product;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "products",
      });
    },
  });
}
