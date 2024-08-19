'use client';

import React, { useState, useCallback } from "react";
import { deleteUser } from "@/app/services/profileService";
import styles from "@/app/components/styles/FormStyles.module.css";

export default function DeleteUserForm() {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUserDelete = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await deleteUser();
  
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        // Call the logout route with the correct path
        const logoutResponse = await fetch('/auth/signout', { method: 'POST' });
        
        if (logoutResponse.ok) {
          // Force a hard refresh of the page
          window.location.href = '/success?title=' + encodeURIComponent("Account Deleted") + '&description=' + encodeURIComponent(result.message || "Your account has been successfully deleted.");
        } else {
          setError("Account deleted but logout failed. Please manually log out.");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    </div>
  );
}