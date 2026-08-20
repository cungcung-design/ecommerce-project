import { useState } from "react";

const STORAGE_KEY = "novatrend-wishlist";

function readWishlist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useWishlist() {
  const [ids, setIds] = useState(readWishlist);

  const isInWishlist = (productId) => ids.includes(productId);

  const toggleWishlist = (productId) => {
    const exists = ids.includes(productId);
    const next = exists
      ? ids.filter((id) => id !== productId)
      : [...ids, productId];

    setIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return !exists;
  };

  return { isInWishlist, toggleWishlist };
}
