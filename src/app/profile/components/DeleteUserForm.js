"use client";


import React, { useState } from "react";
import { deleteUser } from "@/app/services/profileService";
import styles from "@/app/components/styles/FormStyles.module.css";
import { useRouter } from 'next/navigation';

export default function DeleteUserForm() {
  const [error, setError] = useState(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUserDelete = async () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("Calling deleteUser");
      const result = await deleteUser();
      console.log("deleteUser result:", result);
      
      if (result.error) {
        console.error("Error from deleteUser:", result.error);
        setError(result.error);
      } else if (result.success) {
        console.log("User deleted successfully, redirecting");
        router.push('/');
      } else {
        console.error("Unexpected result from deleteUser:", result);
        setError("An unexpected error occurred");
      }
    } catch (err) {
      console.error("Caught error in handleUserDelete:", err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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