'use client';

import React, { useEffect } from 'react';
import Modal from 'react-modal';
import styles from './styles/FeedbackModal.module.css';

const FeedbackModal = ({ isOpen, onConfirm, title, message, type = 'info' }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement('#modal-root');
    }
  }, []);

  console.log("FeedbackModal props:", { isOpen, title, message, type });

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
      onRequestClose={onConfirm}
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
      closeTimeoutMS={300}
      portalClassName={styles.modalPortal}
      parentSelector={() => document.getElementById('modal-root')}
    >
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onConfirm} className={styles.confirmButton}>OK</button>
    </Modal>
  );
};

export default FeedbackModal;