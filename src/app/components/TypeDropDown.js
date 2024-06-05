
import React, { useState, useRef, useEffect } from 'react';
import styles from './styles/DropDown.module.css'; 

export default function TypeDropdown({ types, onSelectType }) {
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
                Element Type
            </button>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    {types.map(type => (
                        <button key={type.name} onClick={() => { onSelectType(type.name); setIsOpen(false); }} className={styles.dropdownItem}>
                            <img src={`/images/types/${type.name}.png`} alt={type.name} className={styles.icon} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

TypeDropdown.displayName = 'TypeDropdown';