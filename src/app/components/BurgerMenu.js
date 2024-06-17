"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from "./styles/BurgerMenu.module.css";

export default function BurgerMenu({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [isMenuOpen]);

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
      {isMenuOpen && (
        <div className={styles.navLinksActive} role="menu">
          {user ? (
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
              <form action="auth/signout" method="post">
                <button
                  className={styles.logoutBtn}
                  type="submit"
                  role="menuitem"
                >
                  Logout
                </button>
              </form>
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
      )}
    </div>
  );
}
