"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/BurgerMenu.module.css";

// Custom hook for handling clicks outside of a component
function useClickOutside(ref, callback) {
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

export default function BurgerMenu({ isAuthenticated }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useClickOutside(menuRef, () => setIsMenuOpen(false));

  useEffect(() => {
    if (isMenuOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isMenuOpen]);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoggingOut(true);
    try {
      const response = await fetch('/auth/signout', { method: 'POST' });
      if (response.ok) {
        // Handle successful logout (e.g., redirect)
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
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
        className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksActive : ''}`} 
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
              {isLoggingOut ? 'Logging out...' : 'Logout'}
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

BurgerMenu.displayName = 'BurgerMenu';