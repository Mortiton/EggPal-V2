import React, { useEffect } from "react";
import Modal from "react-modal";
import styles from "../styles/PrivacyPolicyModal.module.css";

/**
 * PrivacyPolicyModal component that renders a modal with the privacy policy.
 * It displays a heading, the privacy policy text, and buttons to accept or close the modal.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {boolean} props.isOpen - If true, the modal is open. If false, the modal is closed.
 * @param {function} props.onRequestClose - Function to call when the close button is clicked.
 * @param {function} props.onAccept - Function to call when the accept button is clicked.
 * @returns {JSX.Element} A React component.
 */
const PrivacyPolicyModal = ({ isOpen, onRequestClose, onAccept }) => {
  useEffect(() => {
    Modal.setAppElement("#modal-root");
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Privacy Policy"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      aria={{
        labelledby: "privacy-policy-title",
        describedby: "privacy-policy-content"
      }}
    >
      <div className={styles.modalHeader}>
        <h2>Privacy Policy</h2>
        <button 
          onClick={onRequestClose} 
          className={styles.closeButton}
          aria-label="Close privacy policy"
        >
          ×
        </button>
      </div>
      <div className={styles.modalBody}>
        <p>
          This privacy notice explains what to expect us to do with your
          personal information when you use the EggPal application.
        </p>
        <h3>Our Contact Details</h3>
        <p>Email: support@eggpal.net</p>
        <h3>What Information We Collect, Use, and Why</h3>
        <p>
          We collect and use the following information for the operation of
          customer accounts and guarantees:
        </p>
        <ul>
          <li>
            Account information, including registration details (such as email
            addresses and passwords).
          </li>
        </ul>
        <h3>Lawful Bases</h3>
        <p>
          Our lawful bases for collecting or using personal information for the
          operation of customer accounts and guarantees are:
        </p>
        <ul>
          <li>
            <strong>Contract</strong>: We collect and use this information to
            enter into and carry out our contract with you.
          </li>
          <li>
            <strong>Legitimate Interest</strong>:
            <ul>
              <li>
                <strong>Security and Fraud Prevention</strong>: Collecting
                personal information such as email addresses and passwords
                allows us to authenticate users, protect their accounts from
                unauthorised access, and prevent fraudulent activities. This is
                crucial for maintaining the integrity and security of our web
                application, thereby safeguarding user data and ensuring a
                trustworthy environment.
              </li>
              <li>
                <strong>User Experience and Support</strong>: By maintaining
                accurate user accounts, we can provide personalised and
                efficient customer service. This includes helping users with
                account-related issues, providing relevant updates, and ensuring
                they can access the services they signed up for without
                interruption. This enhances the overall user experience and
                satisfaction.
              </li>
              <li>
                <strong>Operational Efficiency</strong>: Proper management of
                user accounts enables us to streamline our operations, manage
                resources effectively, and improve our services. This includes
                ensuring that our system can handle user data efficiently and
                that we can scale our services as our user base grows.
              </li>
            </ul>
          </li>
        </ul>
        <h3>Where We Get Personal Information From</h3>
        <p>
          People directly: We collect personal information directly from users
          during the registration process and through their interactions with
          our application.
        </p>
        <h3>How Long We Keep Information</h3>
        <p>
          We retain personal information for as long as necessary to fulfill the
          purposes we collected it for, including for the purposes of satisfying
          any legal, accounting, or reporting requirements. Specifically:
        </p>
        <ul>
          <li>
            <strong>
              Account Information (including registration details such as email
              addresses and passwords)
            </strong>
            : Retained for the duration of the account's existence. If an
            account is deleted, the associated data will be retained for up to 6
            months to allow for account recovery and to comply with legal
            obligations.
          </li>
          <li>
            <strong>Customer Support Records</strong>: Retained for 2 years from
            the date of the last interaction to help resolve any future issues
            or disputes.
          </li>
          <li>
            <strong>Transaction Records</strong>: Retained for 6 years to comply
            with tax and accounting regulations.
          </li>
          <li>
            <strong>Marketing Data (if applicable)</strong>: Retained until the
            user opts out of marketing communications or withdraws consent.
          </li>
          <li>
            <strong>Legal Compliance Data</strong>: Retained as long as required
            by law.
          </li>
        </ul>
        <p>
          After these periods, we will securely delete or anonymise personal
          information. If deletion is not possible (for example, because the
          personal information has been stored in backup archives), then we will
          securely store and isolate the personal information from any further
          processing until deletion is possible.
        </p>
        <h3>Your Data Protection Rights</h3>
        <p>Under data protection law, you have rights including:</p>
        <ul>
          <li>
            <strong>Your right of access</strong>: You have the right to ask us
            for copies of your personal data.
          </li>
          <li>
            <strong>Your right to rectification</strong>: You have the right to
            ask us to rectify personal data you think is inaccurate. You also
            have the right to ask us to complete information you think is
            incomplete.
          </li>
          <li>
            <strong>Your right to erasure</strong>: You have the right to ask us
            to erase your personal data in certain circumstances.
          </li>
          <li>
            <strong>Your right to restriction of processing</strong>: You have
            the right to ask us to restrict the processing of your personal data
            in certain circumstances.
          </li>
          <li>
            <strong>Your right to object to processing</strong>: You have the
            right to object to the processing of your personal data in certain
            circumstances.
          </li>
          <li>
            <strong>Your right to data portability</strong>: You have the right
            to ask that we transfer the personal data you gave us to another
            organisation, or to you, in certain circumstances.
          </li>
          <li>
            <strong>Your right to withdraw consent</strong>: When we use consent
            as our lawful basis, you have the right to withdraw your consent at
            any time.
          </li>
        </ul>
        <p>
          You don’t usually need to pay a fee to exercise your rights. If you
          make a request, we have one calendar month to respond to you. To make
          a data protection rights request, please contact us using the contact
          details at the top of this privacy notice.
        </p>
        <h3>How to Complain</h3>
        <p>
          If you have any concerns about our use of your personal data, you can
          make a complaint to us using the contact details at the top of this
          privacy notice.
        </p>
        <p>
          If you remain unhappy with how we’ve used your data after raising a
          complaint with us, you can also complain to the ICO.
        </p>
        <p>
          <strong>The ICO’s address:</strong>
        </p>
        <address>
          Information Commissioner’s Office
          <br />
          Wycliffe House
          <br />
          Water Lane
          <br />
          Wilmslow
          <br />
          Cheshire
          <br />
          SK9 5AF
          <br />
        </address>
        <p>Helpline number: 0303 123 1113</p>
        <p>
          Website:{" "}
          <a href="https://www.ico.org.uk/make-a-complaint" className={styles.link}>
            https://www.ico.org.uk/make-a-complaint
          </a>
        </p>
        <p>
          <strong>Last Updated</strong>: 26 May 2024
        </p>
      </div>
      <div className={styles.modalFooter}>
        <button onClick={onAccept} className={styles.acceptButton}>
          Accept
        </button>
        <button onClick={onRequestClose} className={styles.closeButton}>
          Close
        </button>
      </div>
    </Modal>
  );
};

export default PrivacyPolicyModal;
