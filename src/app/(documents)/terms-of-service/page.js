
import React from 'react';
import Link from 'next/link';
import styles from '../../components/styles/Terms.module.css';

export default function Terms() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Terms of Service</h1>
      <p className={styles.text}>Welcome to EggPal, a companion web application for Palworlds that helps users track breeding combinations and save their pals and combinations. By using our service, you agree to these Terms of Service.</p>
      
      <h2 className={styles.subheading}>Acceptance of Terms</h2>
      <p className={styles.text}>By accessing or using EggPal, you agree to be bound by these ToS. If you do not agree to these ToS, please do not use our service.</p>
      
      <h2 className={styles.subheading}>Changes to Terms</h2>
      <p className={styles.text}>We reserve the right to modify these ToS at any time. We will notify you of any significant changes by posting the new ToS on our website. Your continued use of the service after the changes take effect constitutes your acceptance of the new ToS.</p>
      
      <h2 className={styles.subheading}>User Accounts</h2>
      <p className={styles.text}>To use certain features of our service, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
      
      <h2 className={styles.subheading}>User Conduct</h2>
      <p className={styles.text}>You agree not to use our service for any unlawful purpose or in any way that could harm others. This includes, but is not limited to, harassment, impersonation, and the distribution of harmful or illegal content.</p>
      
      <h2 className={styles.subheading}>Intellectual Property</h2>
      <p className={styles.text}>All content on EggPal, including text, graphics, logos, and software, is the property of EggPal or its licensors and is protected by copyright and trademark laws. However, EggPal contains images and content from the game Palworlds, which are the property of Pocketpair, Inc. EggPal is not affiliated with or endorsed by Pocketpair, Inc. All rights to the game and related materials are owned by Pocketpair, Inc.</p>
      
      <h2 className={styles.subheading}>Privacy</h2>
      <p className={styles.text}>Your privacy is important to us. Please review our <Link href="/privacy-policy" className={styles.link}>Privacy Policy</Link> to understand how we collect, use, and protect your personal information.</p>
      
      <h2 className={styles.subheading}>Limitation of Liability</h2>
      <p className={styles.text}>To the fullest extent permitted by law, EggPal shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our service.</p>
      
      <h2 className={styles.subheading}>Termination</h2>
      <p className={styles.text}>We reserve the right to terminate or suspend your account at any time, with or without notice, for any reason, including if you violate these ToS.</p>
      
      <h2 className={styles.subheading}>Governing Law</h2>
      <p className={styles.text}>These ToS are governed by and construed in accordance with the laws of the United Kingdom. Any disputes arising under these ToS shall be subject to the exclusive jurisdiction of the courts of the United Kingdom.</p>
      
      <h2 className={styles.subheading}>Contact Us</h2>
      <p className={styles.text}>If you have any questions about these ToS, please contact us at <a href="mailto:support@eggpal.net" className={styles.link}>support@eggpal.net</a>.</p>
    </div>
  );
};

Terms.displayName = 'Terms'