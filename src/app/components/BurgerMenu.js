"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styles from './styles/BurgerMenu.module.css';

export default function BurgerMenu({ user }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className={styles.burgerMenu}>
          <button onClick={toggleMenu} className={styles.hamburger}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          {isMenuOpen && (
            <div className={styles.navLinksActive}>
              {user ? (
                <>
                  <Link href="/favourite-pals" className={styles.link}>Favourite Pals</Link>
                  <Link href="/saved-combinations" className={styles.link}>Saved Combinations</Link>
                  <Link href="/profile" className={styles.link}>Profile</Link>
                  <form action="auth/signout" method="post">
                    <button className={styles.logoutBtn} type="submit">Logout</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.link}>Login</Link>
                  <Link href="/signup" className={styles.link}>Signup</Link>
                </>
              )}
            </div>
          )}
        </div>
      );
    }