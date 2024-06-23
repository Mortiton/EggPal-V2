import React, { useState, useRef, useEffect } from "react";
import styles from "./styles/DropDown.module.css";

/**
 * WorkDropDown component that renders a dropdown for selecting a work.
 * It calls the onSelectWork function when the user selects a work.
 *
 * @component
 * @param {Object[]} work - The work that the user can select.
 * @param {function} onSelectWork - The function to call when the user selects a work.
 * @returns {JSX.Element} A React component.
 */
export default function WorkDropDown({ work, onSelectWork }) {
  const [isOpen, setIsOpen] = useState(false); 
  const dropdownRef = useRef(null); 
  const buttonRef = useRef(null);
  const buttonId = 'work-dropdown-button'; 

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
              aria-label={workItem.name}
              key={workItem.name}
              onClick={() => {
                onSelectWork(workItem.name);
                setIsOpen(false);
                if (buttonRef.current) {
                  buttonRef.current.focus();
                }
              }}
              className={styles.dropdownItem}
            >
              <img
                src={`/images/work/${workItem.name}.png`}
                alt={workItem.name}
                className={styles.icon}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}