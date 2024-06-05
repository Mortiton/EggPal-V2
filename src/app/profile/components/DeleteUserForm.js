"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteUser } from "../actions";
import styles from "@/app/components/styles/FormStyles.module.css";

export default function DeleteUserForm() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  
    const handleUserDelete = async () => {
      setError(null);
      try {
        await deleteUser();
        setIsSuccessModalOpen(true);
      } catch (err) {
        setError(err.message);
      }
    };
  

  
    return (
      <>
        <div className={styles.inputContainer}>
          {error && <div className={styles.error}>{error}</div>}
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
                style={{ backgroundColor: "red", color: "white" }}
              >
                Are you sure? Confirm Delete
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => setIsConfirmVisible(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </>
    );
  }