import React, { useEffect } from "react";
import Modal from "react-modal";
import styles from "../styles/PrivacyPolicyModal.module.css";

/**
 * @typedef {Object} TermsOfServiceModalProps
 * @property {boolean} isOpen - Whether the modal is open or closed
 * @property {Function} onRequestClose - Function to call when the modal should be closed
 * @property {Function} onAccept - Function to call when the terms are accepted
 */

/**
 * A modal component that displays the Terms of Service for EggPal
 * @param {TermsOfServiceModalProps} props - The component props
 * @returns {JSX.Element} The rendered Terms of Service modal
 */
const TermsOfServiceModal = ({ isOpen, onRequestClose, onAccept }) => {
  /**
   * Sets the app element for react-modal accessibility features
   */
  useEffect(() => {
    Modal.setAppElement("#modal-root");
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Terms of Service"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      aria={{
        labelledby: "terms-of-service-title",
        describedby: "terms-of-service-content",
      }}
    >
      <div className={styles.modalHeader}>
        <h2>Terms of Service</h2>
        <button
          onClick={onRequestClose}
          className={styles.closeButton}
          aria-label="Close terms of service"
        >
          ×
        </button>
      </div>
      <div className={styles.modalBody}>
        <p className={styles.text}>
          Welcome to EggPal, a companion web application for Palworlds that
          helps users track breeding combinations and save their pals and
          combinations. By using our service, you agree to these Terms of
          Service.
        </p>

        <h3>Acceptance of Terms</h3>
        <p className={styles.text}>
          By accessing or using EggPal, you agree to be bound by these ToS. If
          you do not agree to these ToS, please do not use our service.
        </p>

        <h3>Changes to Terms</h3>
        <p className={styles.text}>
          We reserve the right to modify these ToS at any time. We will notify
          you of any significant changes by posting the new ToS on our website.
          Your continued use of the service after the changes take effect
          constitutes your acceptance of the new ToS.
        </p>

        <h3>User Accounts</h3>
        <p className={styles.text}>
          To use certain features of our service, you must create an account.
          You are responsible for maintaining the confidentiality of your
          account information and for all activities that occur under your
          account. You agree to notify us immediately of any unauthorised use of
          your account.
        </p>

        <h3>User Conduct</h3>
        <p className={styles.text}>
          You agree not to use our service for any unlawful purpose or in any
          way that could harm others. This includes, but is not limited to,
          harassment, impersonation, and the distribution of harmful or illegal
          content.
        </p>

        <h3>Intellectual Property</h3>
        <p className={styles.text}>
          All content on EggPal, including text, graphics, logos, and software,
          is the property of EggPal or its licensors and is protected by
          copyright and trademark laws. However, EggPal contains images and
          content from the game Palworlds, which are the property of Pocketpair,
          Inc. EggPal is not affiliated with or endorsed by Pocketpair, Inc. All
          rights to the game and related materials are owned by Pocketpair, Inc.
        </p>

        <h3>Privacy</h3>
        <p className={styles.text}>
          Your privacy is important to us. Please review our{" "}
          <a href="/privacy-policy" className={styles.link}>
            Privacy Policy
          </a>{" "}
          to understand how we collect, use, and protect your personal
          information.
        </p>

        <h3>Limitation of Liability</h3>
        <p className={styles.text}>
          To the fullest extent permitted by law, EggPal shall not be liable for
          any indirect, incidental, special, or consequential damages arising
          out of or in connection with the use of our service.
        </p>

        <h3>Termination</h3>
        <p className={styles.text}>
          We reserve the right to terminate or suspend your account at any time,
          with or without notice, for any reason, including if you violate these
          ToS.
        </p>

        <h3>Governing Law</h3>
        <p className={styles.text}>
          These ToS are governed by and construed in accordance with the laws of
          the United Kingdom. Any disputes arising under these ToS shall be
          subject to the exclusive jurisdiction of the courts of the United
          Kingdom.
        </p>

        <h3>Contact Us</h3>
        <p className={styles.text}>
          If you have any questions about these ToS, please contact us at{" "}
          <a href="mailto:support@eggpal.net" className={styles.link}>
            support@eggpal.net
          </a>
          .
        </p>
      </div>
      <div className={styles.modalFooter}>
        <button
          onClick={onAccept}
          className={styles.acceptButton}
          aria-label="Accept terms of service"
        >
          Accept
        </button>
        <button
          onClick={onRequestClose}
          className={styles.closeButton}
          aria-label="Close terms of service"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

TermsOfServiceModal.displayName = "TermsOfServiceModal";

export default TermsOfServiceModal;
