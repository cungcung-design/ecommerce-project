import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  disableBrowserScrollRestoration,
  useInstantScrollToTop,
} from "../lib/scrollToTop";

function MainLayout() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    disableBrowserScrollRestoration();
  }, []);

  useInstantScrollToTop([pathname], { skip: Boolean(hash) });

  return (
    <div className="min-h-screen bg-white [overflow-anchor:none]">
      <div id="page-top" tabIndex={-1} className="sr-only" />
      <Navbar />

      <main className="w-full px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
