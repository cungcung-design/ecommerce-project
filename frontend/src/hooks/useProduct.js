import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],

    queryFn: async () => {
      const response = await api.get(
        `/products/${id}`
      );

      return response.data.product;
    },

    enabled: Boolean(id),

    staleTime: 1000 * 60 * 5,
  });
}
