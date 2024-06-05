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
  const [isOpen, setIsOpen] = useState(false); // State variable for whether the dropdown is open
  const dropdownRef = useRef(null); // Ref for the dropdown div

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

  // Render the dropdown
  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        Element Type
      </button>
      {isOpen && (
        <div className={styles.dropdownContent}>
          {types.map((type) => (
            <button
              key={type.name}
              onClick={() => {
                onSelectType(type.name);
                setIsOpen(false);
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
