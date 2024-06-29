import React, { useState, useRef, useEffect } from "react";
import styles from "./styles/DropDown.module.css";

/**
 * TypeDropdown component that renders a dropdown for selecting a type.
 * It calls the onSelectType function when the user selects a type.
 *
 * @component
 * @param {Object[]} types - The types that the user can select.
 * @param {function} onSelectType - The function to call when the user selects a type.
 * @returns {JSX.Element} A React component.
 */
export default function TypeDropdown({ types, onSelectType }) {
  const [isOpen, setIsOpen] = useState(false); 
  const dropdownRef = useRef(null); 
  const buttonRef = useRef(null);
  
  // Function to toggle whether the dropdown is open
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Effect to close the dropdown when the user clicks outside of it
  useEffect(() => {
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
        aria-label="Element Type"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
        className={styles.dropdownButton}
        onKeyDown={handleKeyDown}
      >
        Element Type
      </button>
      {isOpen && (
        <div
          className={styles.dropdownContent}
          role="listbox"
          aria-label="Element Type"
        >
          {types.map((type) => (
            <button
              role="option"
              aria-selected={false}
              aria-label={type.name}
              key={type.name}
              onClick={() => {
                onSelectType(type.name);
                setIsOpen(false);
                buttonRef;
              }}
              className={styles.dropdownItem}
            >
              <img
                src={`/images/types/${type.name}.png`}
                alt={type.name}
                className={styles.icon}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

TypeDropdown.displayName = 'TypeDropdown'