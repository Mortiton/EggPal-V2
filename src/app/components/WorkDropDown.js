import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/DropDown.module.css'; 

export default function WorkDropDown({ work, onSelectWork }) {
    const [isOpen, setIsOpen] = useState(false); 
    const dropdownRef = useRef(null); 


    const toggleDropdown = () => setIsOpen(!isOpen);


    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false); 
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside); 
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside); 
      };
    }, [isOpen]); 

    return (
      <div ref={dropdownRef} className={styles.dropdown}>
        <button onClick={toggleDropdown} className={styles.dropdownButton}>
          Base Skills
        </button>
        {isOpen && (
          <div className={styles.dropdownContent}>
            {work.map(workItem => (
              <button 
                key={workItem.name} 
                onClick={() => { onSelectWork(workItem.name); setIsOpen(false); }} 
                className={styles.dropdownItem}>
                <img src={`/images/work/${workItem.name}.png`} alt={workItem.name} className={styles.icon} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
}

WorkDropDown.displayName = 'WorkDropDown';