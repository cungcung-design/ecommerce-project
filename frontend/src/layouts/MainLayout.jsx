import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AIChatWidget from "../components/ai/AIChatWidget";
import { AIChatProvider } from "../context/AIChatContext";
import { useAuth } from "../context/AuthContext";
import {
  disableBrowserScrollRestoration,
  useInstantScrollToTop,
} from "../lib/scrollToTop";

function MainLayout() {
  const { pathname, hash } = useLocation();
  const { user } = useAuth();

  useLayoutEffect(() => {
    disableBrowserScrollRestoration();
  }, []);

  useInstantScrollToTop([pathname], { skip: Boolean(hash) });

  return (
    <AIChatProvider>
      <div className="min-h-screen bg-white [overflow-anchor:none]">
        <div id="page-top" tabIndex={-1} className="sr-only" />
        <Navbar />

        <main className="w-full py-8">
          <Outlet />
        </main>

        <Footer />
        {user && pathname !== "/assistant" && <AIChatWidget />}
      </div>
    </AIChatProvider>
  );
}

export default MainLayout;
