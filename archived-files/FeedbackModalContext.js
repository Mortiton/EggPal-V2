'use client';

import React, { createContext, useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const FeedbackModalContext = createContext();

export function FeedbackModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });
  const router = useRouter();

//   const openFeedbackModal = useCallback((title, message, type) => {
//     console.log("Opening feedback modal:", { title, message, type });
//     setModalState({
//       isOpen: true,
//       title,
//       message,
//       type,
//     });
//   }, []);
  const openFeedbackModal = useCallback((title, message, type) => {
    console.log("Opening feedback modal:", { title, message, type });
    setModalState({
      isOpen: true,
      title,
      message,
      type,
    });
    console.log("Modal state after setting:", modalState); // Check if state changes correctly
  }, []);

  const closeFeedbackModal = useCallback(() => {
    console.log("Closing feedback modal");
    setModalState({
      isOpen: false,
      title: '',
      message: '',
      type: 'info',
    });
  }, []);

  const handleModalClose = useCallback(() => {
    if (modalState.type === 'success') {
      console.log("Navigating to home page after successful action");
      router.push('/');
    }
    closeFeedbackModal();
  }, [modalState.type, closeFeedbackModal, router]);

  return (
    <FeedbackModalContext.Provider value={{ modalState, openFeedbackModal, closeFeedbackModal, handleModalClose }}>
      {children}
    </FeedbackModalContext.Provider>
  );
}

export function useFeedbackModal() {
  const context = useContext(FeedbackModalContext);
  if (!context) {
    throw new Error('useFeedbackModal must be used within a FeedbackModalProvider');
  }
  return context;
}