import React, { useEffect } from "react";
import Modal from 'react-modal';
import styles from './styles/SuccessModal.module.css';

/**
 * SuccessModal component that renders a success modal.
 * It displays a success message and a confirmation button.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.onRequestClose - The function to call when the user requests to close the modal.
 * @param {function} props.onConfirm - The function to call when the user clicks the confirmation button.
 * @param {string} props.message - The success message to display.
 * @returns {JSX.Element} A React component.
 */
const SuccessModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  // Set the app element for the modal
  useEffect(() => {
    Modal.setAppElement("#modal-root");
  }, []);

  useEffect(() => {
    if (isOpen) {
      const confirmButton = document.querySelector(`.${styles.confirmButton}`);
      if (confirmButton) {
        confirmButton.focus();
      }
    }
  }, [isOpen]);

  // Render the modal
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Success"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      aria={{
        labelledby: "success-modal-title",
        describedby: "success-modal-message"
      }}
    >
      <h2 id="success-modal-title">Success</h2>
      <p id="success-modal-message">{message}</p>
      <button onClick={onConfirm} className={styles.confirmButton}>
        OK
      </button>
    </Modal>
  );
};

export default SuccessModal;