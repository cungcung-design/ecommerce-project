import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { useNotification } from "../context/NotificationContext";
import { getFriendlyError } from "../lib/getFriendlyError";

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
  const { error: notifyError } = useNotification();

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
      notifyError(getFriendlyError(err, "Couldn't update the quantity. Please try again."));
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

const removalsInFlight = new Set();

function toProductId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function isRemovalInFlight(productId) {
  const id = toProductId(productId);
  return id != null && removalsInFlight.has(id);
}

function withoutProduct(cart, productId) {
  if (!cart?.items) return cart;
  return {
    ...cart,
    items: cart.items.filter((item) => Number(item.productId) !== productId),
  };
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const { error: notifyError } = useNotification();

  return useMutation({
    mutationFn: async (productId) => {
      const id = toProductId(productId);
      if (!id) {
        throw new Error("Couldn't remove that item. Please try again.");
      }

      try {
        const response = await api.delete(`/cart/items/${id}`);
        return response.data;
      } catch (error) {
        if (error.response?.status === 404) {
          return { success: true, alreadyRemoved: true };
        }
        throw error;
      }
    },

    onMutate: async (productId) => {
      const id = toProductId(productId);
      if (!id) {
        throw new Error("Couldn't remove that item. Please try again.");
      }
      if (removalsInFlight.has(id)) {
        const error = new Error("duplicate-remove");
        error.duplicate = true;
        throw error;
      }

      removalsInFlight.add(id);
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (old) => withoutProduct(old, id));

      return { previousCart, id };
    },

    onError: async (err, productId, context) => {
      if (err?.duplicate) return;

      const id = context?.id || toProductId(productId);
      try {
        const response = await api.get("/cart");
        const cart = response.data?.data || { items: [] };
        queryClient.setQueryData(["cart"], cart);
        const stillThere = cart.items?.some((item) => Number(item.productId) === id);
        if (!stillThere) return;
      } catch {
        if (context?.previousCart) {
          queryClient.setQueryData(["cart"], context.previousCart);
        }
      }

      notifyError(getFriendlyError(err, "Couldn't remove that item. Please try again."));
    },

    onSettled: (_data, err, productId) => {
      if (err?.duplicate) return;
      const id = toProductId(productId);
      if (id) removalsInFlight.delete(id);
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
