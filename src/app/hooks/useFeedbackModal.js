'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useFeedbackModal() {
  const modalStateRef = useRef({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });
  const [, forceRender] = useState(0);
  const router = useRouter();

  const openFeedbackModal = useCallback((title, message, type) => {
    console.log("Attempting to open feedback modal:", { title, message, type });
    if (modalStateRef.current.isOpen) {
      console.log("Modal is already open, updating content");
      modalStateRef.current = {
        ...modalStateRef.current,
        title,
        message,
        type,
      };
    } else {
      console.log("Opening new modal");
      modalStateRef.current = {
        isOpen: true,
        title,
        message,
        type,
      };
    }
    forceRender(prev => prev + 1);
    console.log("Modal state after opening/updating:", modalStateRef.current);
  }, []);

  const closeFeedbackModal = useCallback(() => {
    console.log("Closing feedback modal");
    modalStateRef.current = {
      isOpen: false,
      title: '',
      message: '',
      type: 'info',
    };
    forceRender(prev => prev + 1);
    console.log("Modal state after closing:", modalStateRef.current);
  }, []);

  const handleModalClose = useCallback(() => {
    if (modalStateRef.current.type === 'success') {
      console.log("Navigating to home page after successful action");
      router.push('/');
    }
    closeFeedbackModal();
  }, [closeFeedbackModal, router]);

  useEffect(() => {
    console.log("Current feedback modal state:", modalStateRef.current);
  });

  return {
    feedbackModal: modalStateRef.current,
    openFeedbackModal,
    closeFeedbackModal,
    handleModalClose,
  };
}
