import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export function useCart(options = {}) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      try {
        const response = await api.get("/cart");
        return response.data.data || { items: [] };
      } catch (error) {
        if (error.response?.status === 401) {
          return { items: [] };
        }
        throw error;
      }
    },
    ...options,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const response = await api.post("/cart/items", {
        productId,
        quantity,
      });
      return response.data.data;
    },

    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) {
          return {
            items: [
              {
                id: `temp-${Date.now()}`,
                cartId: 0,
                productId,
                quantity,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                product: {
                  id: productId,
                  name: "",
                  price: 0,
                  stock: 999,
                },
              },
            ],
          };
        }

        const existingIndex = old.items.findIndex(
          (item) => item.productId === productId
        );

        if (existingIndex >= 0) {
          const newItems = [...old.items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + quantity,
          };
          return { ...old, items: newItems };
        }

        return {
          ...old,
          items: [
            ...old.items,
            {
              id: `temp-${Date.now()}`,
              cartId: old.id || 0,
              productId,
              quantity,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              product: {
                id: productId,
                name: "",
                price: 0,
                stock: 999,
              },
            },
          ],
        };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }) => {
      const response = await api.put(`/cart/items/${productId}`, {
        quantity,
      });
      return response.data.data;
    },

    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;

        const existingIndex = old.items.findIndex(
          (item) => item.productId === productId
        );

        if (existingIndex < 0) return old;

        const newItems = [...old.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity,
        };

        return { ...old, items: newItems };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId) => {
      const response = await api.delete(`/cart/items/${productId}`);
      return response.data;
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((item) => item.productId !== productId),
        };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.delete("/cart");
      return response.data;
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => {
        if (!old) return old;
        return { ...old, items: [] };
      });

      return { previousCart };
    },

    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
