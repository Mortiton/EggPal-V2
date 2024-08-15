"use client"

import React, { useEffect } from "react";
import Modal from 'react-modal';
import styles from './styles/FeedbackModal.module.css';

const FeedbackModal = ({ isOpen, onRequestClose, onConfirm, title, message, type = 'info' }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#modal-root');
    }
  }, []);

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return styles.modalContentSuccess;
      case 'error':
        return styles.modalContentError;
      case 'info':
      default:
        return styles.modalContentInfo;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className={{
        base: `${styles.modalContent} ${getTypeClass()}`,
        afterOpen: styles.modalContentAfterOpen,
        beforeClose: styles.modalContentBeforeClose,
      }}
      overlayClassName={{
        base: styles.modalOverlay,
        afterOpen: styles.modalOverlayAfterOpen,
        beforeClose: styles.modalOverlayBeforeClose,
      }}
    >
      <h2 id="feedback-modal-title">{title}</h2>
      <p id="feedback-modal-message">{message}</p>
      <button onClick={onConfirm} className={styles.confirmButton}>
        OK
      </button>
    </Modal>
  );
};

FeedbackModal.displayName = 'FeedbackModal';

export default FeedbackModal;