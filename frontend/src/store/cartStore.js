import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        }),

      increaseQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item;
            if (item.quantity >= item.stock) return item;
            return { ...item, quantity: item.quantity + 1 };
          }),
        })),

      decreaseQuantity: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ items: [] }),

      upsertCartItem: (cartItem) =>
        set((state) => {
          const product = cartItem.product || cartItem;
          const existingItem = state.items.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...product, quantity: cartItem.quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...product, quantity: cartItem.quantity }],
          };
        }),
    }),
    { name: "shopping-cart" }
  )
);
