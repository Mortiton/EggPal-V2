import React from "react";
import localFont from "next/font/local";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { FavouritesProvider } from "./context/FavouritesContext";
import { SavedCombinationsProvider } from "./context/SavedCombinationsContext";
import { getUser } from "./utils/getUser";

/**
 * Metadata for the layout
 * @type {Object} Represents the Metadata object from Next.js
 */
export const metadata = {
  title: "EggPal",
  description: "Palworld Breeding Companion",
};

/**
 * Custom font configuration using next/font/local
 * @type {Object}
 */
const mainFont = localFont({
  src: "./fonts/slkscr.ttf",
  display: "swap",
});

/**
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user
 * @property {string} email - The email address of the user
 */

/**
 * The root layout component that wraps the entire application
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout
 * @returns {Promise<JSX.Element>} The rendered root layout
 */
const RootLayout = async ({ children }) => {
  /**
   * Fetches the current user data
   * @type {User|null}
   */
  const user = await getUser();
  return (
    <html lang="en">
      <body className={mainFont.className}>
        <FavouritesProvider initialUser={user}>
          <SavedCombinationsProvider initialUser={user}>
            <header>
              <NavBar user={user} />
            </header>
            <div className="page-container">
              <main className="content-wrap">
                {children}
                <div
                  id="modal-root"
                  style={{ position: "fixed", zIndex: 9999 }}
                ></div>
                <SpeedInsights />
              </main>

              <footer>
                <Footer />
              </footer>
            </div>
            <ToastContainer
              theme="dark"
              style={{ top: "100px" }}
              autoClose={1000}
              hideProgressBar={true}
              position="top-left"
            />
          </SavedCombinationsProvider>
        </FavouritesProvider>
      </body>
    </html>
  );
};

export default RootLayout;
