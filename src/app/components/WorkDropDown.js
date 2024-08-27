"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./styles/DropDown.module.css";

/**
 * @typedef {Object} WorkType
 * @property {string} icon_name - The name of the work skill icon
 * @property {string} icon_url - The URL of the work skill icon image
 * @property {'Work'} category - Always 'Work' for work types
 * @property {number} work_order - The order for work types
 */

/**
 * WorkDropDown component for selecting base skills (work types).
 *
 * @component
 * @param {Object} props - The component props
 * @param {WorkType[]} props.work - Array of work types to display in the dropdown
 * @param {function} props.onSelectWork - Callback function to handle work type selection
 * @returns {JSX.Element} The rendered WorkDropDown component
 */
export default function WorkDropDown({ work, onSelectWork }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const buttonId = "work-dropdown-button";

  /**
   * Toggles the dropdown open/closed state.
   */
  const toggleDropdown = () => setIsOpen(!isOpen);

  /**
   * Effect hook to close the dropdown when clicking outside.
   */
  useEffect(() => {
    /**
     * Handles click events outside the dropdown.
     * @param {MouseEvent} event - The mouse event
     */
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Handles keydown events for accessibility.
   * @param {React.KeyboardEvent} event - The keyboard event
   */
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      if (buttonRef.current) {
        buttonRef.current.focus();
      }
    }
  };

  // Render the dropdown
  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <button
        id={buttonId}
        aria-label="Base Skills"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className={styles.dropdownButton}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
      >
        Base Skills
      </button>
      {isOpen && (
        <div
          className={styles.dropdownContent}
          role="listbox"
          aria-labelledby={buttonId}
        >
          {work.map((workItem) => (
            <button
              role="option"
              aria-selected={false}
              aria-label={workItem.icon_name}
              key={workItem.icon_name}
              onClick={() => {
                onSelectWork(workItem.icon_name);
                setIsOpen(false);
                if (buttonRef.current) {
                  buttonRef.current.focus();
                }
              }}
              className={styles.dropdownItem}
            >
              <Image
                src={workItem.icon_url}
                alt={workItem.icon_name}
                width={30}
                height={30}
                className={styles.icon}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

WorkDropDown.displayName = "WorkDropDown";
