import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import api from "../services/api";


export function useAdminProducts(
  params = {}
) {
  return useQuery({
    queryKey: [
      "admin",
      "products",
      params,
    ],

    queryFn: async () => {
      const response =
        await api.get(
          "/admin/products",
          {
            params,
          }
        );

      return response.data;
    },
  });
}


export function useCreateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (product) => {
      const response =
        await api.post(
          "/admin/products",
          product
        );

      return response.data.product;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "products",
        ],
      });
    },
  });
}


export function useUpdateProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }) => {
      const response =
        await api.put(
          `/admin/products/${id}`,
          data
        );

      return response.data.product;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "products",
        ],
      });
    },
  });
}


export function useUpdateProductStatus() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }) => {
      const response =
        await api.patch(
          `/admin/products/${id}/status`,
          { isActive }
        );

      return response.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "products",
        ],
      });
    },
  });
}


export function useDeleteProduct() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(
        `/admin/products/${id}`
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "products",
        ],
      });
    },
  });
}
