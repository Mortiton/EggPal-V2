"use client";

import React, { useState, useCallback } from "react";
import { deleteUser } from "@/app/services/profileService";
import styles from "@/app/components/styles/FormStyles.module.css";
import { useRouter } from 'next/navigation';
import FeedbackModal from "@/app/components/FeedbackModal";
import { createClient } from '@/app/utils/supabase/client'

export default function DeleteUserForm() {
  const [error, setError] = useState(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const router = useRouter();
  const supabase = createClient();

  const handleUserDelete = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("Calling deleteUser");
      const result = await deleteUser();
      console.log("deleteUser result:", result);
      
      if (result.error) {
        console.error("Error from deleteUser:", result.error);
        setError(result.error);
        setModalContent(prevContent => ({
          title: "Error",
          message: result.error,
          type: "error",
        }));
      } else if (result.success) {
        console.log("User deleted successfully");
        
        // Force client-side logout
        await supabase.auth.signOut();
        
        // Clear any user-related data from local storage
        localStorage.removeItem('supabase.auth.token');
        
        setModalContent(prevContent => ({
          title: "Account Deleted",
          message: result.message || "Your account has been successfully deleted.",
          type: "success",
        }));
      } else {
        console.error("Unexpected result from deleteUser:", result);
        setError("An unexpected error occurred");
        setModalContent(prevContent => ({
          title: "Error",
          message: "An unexpected error occurred",
          type: "error",
        }));
      }
      setIsFeedbackModalOpen(true);
    } catch (err) {
      console.error("Caught error in handleUserDelete:", err);
      setError(err.message || "An unexpected error occurred");
      setModalContent(prevContent => ({
        title: "Error",
        message: err.message || "An unexpected error occurred",
        type: "error",
      }));
      setIsFeedbackModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const handleFeedbackModalClose = useCallback(() => {
    setIsFeedbackModalOpen(false);
    if (modalContent.type === "success") {
      // Force a full page reload to ensure all state is cleared and server re-fetches user data
      window.location.href = '/';
    }
  }, [modalContent.type]);
  return (
    <div className={styles.inputContainer}>
      {error && <div className={styles.error} role="alert">{error}</div>}
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
      {isFeedbackModalOpen && (
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onRequestClose={handleFeedbackModalClose}
          onConfirm={handleFeedbackModalConfirm}
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
        />
      )}
    </div>
  );
}