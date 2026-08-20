import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useNotification from "./useNotification";

const ACTION_MESSAGES = {
  quickAdd: "Please log in to add items to your cart.",
  addToCart: "Please log in to add items to your cart.",
  buyNow: "Please log in to continue with your purchase.",
  wishlist: "Please log in to save items to your wishlist.",
  checkout: "Please log in to continue to checkout.",
  orders: "Please log in to view your orders.",
  account: "Please log in to access your account.",
};

export function useRequireAuth(action = "default") {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notify } = useNotification();

  const isLoggedIn = Boolean(user);

  const requireAuth = (redirectTo) => {
    if (isLoggedIn) return true;

    const message = ACTION_MESSAGES[action] || "Please log in to continue.";
    const targetPath = redirectTo || window.location.pathname + window.location.search;

    notify.info(message, {
      duration: 5000,
      action: {
        text: "Log In",
        onClick: () => {
          navigate(`/login?redirectTo=${encodeURIComponent(targetPath)}`);
        },
      },
    });

    return false;
  };

  return { isLoggedIn, requireAuth };
}
