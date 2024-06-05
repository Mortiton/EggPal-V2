import React, { useEffect } from "react";
import Modal from 'react-modal';
import styles from './styles/SuccessModal.module.css';

const SuccessModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  useEffect(() => {
    Modal.setAppElement("#modal-root");
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Success"
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
    >
      <h2>Success</h2>
      <p>{message}</p>
      <button onClick={onConfirm} className={styles.confirmButton}>
        OK
      </button>
    </Modal>
  );
};

export default SuccessModal;