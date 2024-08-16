"use client"

  import React, { useEffect } from 'react';
  import Modal from 'react-modal';
  import styles from './styles/FeedbackModal.module.css';
  
  const FeedbackModal = ({ isOpen, onRequestClose, onConfirm, title, message, type = 'info' }) => {
    console.log('FeedbackModal render:', { isOpen, title, message, type });
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
        <h2>{title}</h2>
        <p>{message}</p>
        <button className={styles.confirmButton} onClick={onConfirm}>OK</button>
      </Modal>
    );
  };
  
  export default FeedbackModal;