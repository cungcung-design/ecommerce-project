import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],

    queryFn: async () => {
      const response = await api.get("/products", {
        params,
      });

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });
}