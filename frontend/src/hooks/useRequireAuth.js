import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function useRequireAuth() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isLoggedIn = Boolean(user);

  const requireAuth = (redirectTo) => {
    if (isLoggedIn) return true;

    const targetPath = redirectTo || window.location.pathname + window.location.search;
    navigate(`/login?redirectTo=${encodeURIComponent(targetPath)}`);

    return false;
  };

  return { isLoggedIn, requireAuth };
}
