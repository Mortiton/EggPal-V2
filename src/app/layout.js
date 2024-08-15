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

export const metadata = {
  title: "EggPal",
  description: "Palworld Breeding Companion",
};

const mainFont = localFont({
  src: "./fonts/slkscr.ttf",
  display: "swap",
});

const RootLayout = async ({ children }) => {
  const user = await getUser();
  console.log(user);

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
                {React.Children.map(children, (child) =>
                  React.isValidElement(child)
                    ? React.cloneElement(child, { user })
                    : child
                )}
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
        <div id="modal-root"></div>
      </body>
    </html>
  );
};

export default RootLayout;
