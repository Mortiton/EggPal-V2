"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./styles/DropDown.module.css";

/**
 * @typedef {Object} PalType
 * @property {string} icon_name - The name of the icon
 * @property {string} icon_url - The URL of the icon image
 * @property {'Type'} category - Always 'Type' for pal types
 * @property {number} type_order - The order for pal types
 */

/**
 * TypeDropdown component for selecting pal types.
 *
 * @component
 * @param {Object} props - The component props
 * @param {PalType[]} props.types - Array of pal types to display in the dropdown
 * @param {function} props.onSelectType - Callback function to handle type selection
 * @returns {JSX.Element} The rendered TypeDropdown component
 */
export default function TypeDropdown({ types, onSelectType }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const buttonId = "type-dropdown-button";

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

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <button
        id={buttonId}
        aria-label="Element Type"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className={styles.dropdownButton}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
      >
        Element Type
      </button>
      {isOpen && (
        <div
          className={styles.dropdownContent}
          role="listbox"
          aria-labelledby={buttonId}
        >
          {types.map((type) => (
            <button
              role="option"
              aria-selected={false}
              aria-label={type.icon_name}
              key={type.icon_name}
              onClick={() => {
                onSelectType(type.icon_name);
                setIsOpen(false);
                buttonRef.current.focus();
              }}
              className={styles.dropdownItem}
            >
              <Image
                src={type.icon_url}
                alt={type.icon_name}
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

TypeDropdown.displayName = "TypeDropdown";
