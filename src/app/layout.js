import React from "react";
import localFont from "next/font/local";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { UserProvider } from "./context/UserContext";
import { FavouritesProvider } from "./context/FavouritesContext";

/**
 * Metadata for the application
 */
export const metadata = {
  title: "EggPal",
  description: "Palworld Breeding Companion",
};

const mainFont = localFont({
  src: "./fonts/slkscr.ttf",
  display: "swap",
});

/**
 * RootLayout
 * The main layout component for the application.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactNode} The layout with user data.
 */
const RootLayout = ({ children }) => {
  return (
    <UserProvider>
      <FavouritesProvider>
        <html lang="en">
          <body className={mainFont.className}>
            <header>
              <NavBar />
            </header>
            <div className="page-container">
              <main className="content-wrap">
                {children}
                <SpeedInsights />
              </main>
              <footer>
                <Footer />
              </footer>
            </div>
            <ToastContainer theme="dark" style={{ top: "100px" }} />
            <div id="modal-root"></div>
          </body>
        </html>
      </FavouritesProvider>
    </UserProvider>
  );
};

export default RootLayout;
