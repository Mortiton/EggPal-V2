import React from 'react';
import Link from 'next/link';
import styles from './styles/Footer.module.css'; 

/**
 * A footer component that displays copyright, disclaimer text, and links to Privacy Policy and Terms of Service.
 *
 * @component
 *
 * @returns {React.Element} The rendered React element.
 */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyrightText}>
        © 2024 EggPal. All rights reserved. Contact us at <a href="mailto:support@eggpal.net">support@eggpal.net</a>
      </p>
      <p className={styles.disclaimerText}>
        This website is not affiliated with Palworlds. All game content and materials are trademarks of Pocketpair, Inc.
      </p>
      <nav className={styles.footerNav} aria-label="Footer navigation">
        <Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link>
        <Link href="/terms-of-service" className={styles.link}>Terms of Service</Link>
      </nav>
    </footer>
  );
}