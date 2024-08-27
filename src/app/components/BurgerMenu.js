"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/BurgerMenu.module.css";

/**
 * Custom hook for handling clicks outside of a component.
 *
 * @param {React.RefObject} ref - The ref object attached to the component.
 * @param {Function} callback - The function to be called when a click outside occurs.
 */
function useClickOutside(ref, callback) {
  /**
   * Handler for the click event.
   *
   * @param {MouseEvent} event - The mouse event object.
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * BurgerMenu component for displaying a responsive navigation menu.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isAuthenticated - Indicates whether the user is authenticated.
 * @returns {JSX.Element} The rendered BurgerMenu component.
 */
export default function BurgerMenu({ isAuthenticated }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  /**
   * Toggles the menu open/closed state.
   */
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    if (isMenuOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isMenuOpen]);

  /**
   * Handles the logout process.
   *
   * @param {React.MouseEvent} e - The click event.
   */
  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    try {
      const response = await fetch("/auth/signout", { method: "POST" });
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={styles.burgerMenu} ref={menuRef}>
      <button
        onClick={toggleMenu}
        className={styles.hamburger}
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div
        className={`${styles.navLinks} ${
          isMenuOpen ? styles.navLinksActive : ""
        }`}
        role="menu"
      >
        {isAuthenticated ? (
          <>
            <Link
              href="/favourite-pals"
              className={styles.link}
              role="menuitem"
              ref={firstLinkRef}
            >
              Favourite Pals
            </Link>
            <Link
              href="/saved-combinations"
              className={styles.link}
              role="menuitem"
            >
              Saved Combinations
            </Link>
            <Link href="/profile" className={styles.link} role="menuitem">
              Profile
            </Link>
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
              disabled={isLoggingOut}
              role="menuitem"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={styles.link}
              role="menuitem"
              ref={firstLinkRef}
            >
              Login
            </Link>
            <Link href="/signup" className={styles.link} role="menuitem">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

BurgerMenu.displayName = "BurgerMenu";
