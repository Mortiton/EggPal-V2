import React from 'react';
import Modal from 'react-modal';
import styles from './styles/FeedbackModal.module.css';

// Ensure this is called once in your app, preferably in a root component
if (typeof window !== 'undefined') {
  Modal.setAppElement('#modal-root');
}

const FeedbackModal = ({ isOpen, onConfirm, title, message, type = 'info' }) => {
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
    >
      <h2>{title}</h2>
      <p>{message}</p>
      <button onClick={onConfirm} className={styles.confirmButton}>OK</button>
    </Modal>
  );
};

export default FeedbackModal;