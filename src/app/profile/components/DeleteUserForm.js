'use client';

import React, { useState, useCallback, useEffect } from "react";
import { deleteUser } from "@/app/services/profileService";
import styles from "@/app/components/styles/FormStyles.module.css";
import FeedbackModal from "@/app/components/FeedbackModal";
import { createClient } from '@/app/utils/supabase/client'
import { useFeedbackModal } from "@/app/context/FeedbackModalContext";

export default function DeleteUserForm() {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { modalState, openFeedbackModal, handleModalClose } = useFeedbackModal();

  const handleUserDelete = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await deleteUser();
  
      if (result.error) {
        openFeedbackModal("Error", result.error, "error");
      } else if (result.success) {
        openFeedbackModal("Account Deleted", result.message || "Your account has been successfully deleted.", "success");
      } else {
        openFeedbackModal("Error", "An unexpected error occurred", "error");
      }
    } catch (err) {
      openFeedbackModal("Error", err.message || "An unexpected error occurred", "error");
    } finally {
      setIsLoading(false);
    }
  }, [openFeedbackModal]);

  return (
    <>
      <div className={styles.inputContainer}>
        {!isConfirmVisible ? (
          <button
            className={styles.button}
            onClick={() => setIsConfirmVisible(true)}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Delete Account
          </button>
        ) : (
          <>
            <button
              className={styles.button}
              onClick={handleUserDelete}
              disabled={isLoading}
              style={{ backgroundColor: "red", color: "white" }}
            >
              {isLoading ? "Processing..." : "Are you sure? Confirm Delete"}
            </button>
            <button
              className={styles.cancelButton}
              onClick={() => setIsConfirmVisible(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </>
        )}
      </div>
      {modalState.isOpen && (
        <FeedbackModal
          isOpen={modalState.isOpen}
          onRequestClose={handleModalClose}
          onConfirm={handleModalClose}
          title={modalState.title}
          message={modalState.message}
          type={modalState.type}
        />
      )}
    </>
  );
}
