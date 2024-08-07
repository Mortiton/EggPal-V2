"use client";
import React from 'react';
import styles from './styles/SearchBar.module.css'

/**
 * SearchBar component that renders a search bar.
 * It calls the onSearch function when the user types in the search bar.
 *
 * @component
 * @param {function} onSearch - The function to call when the user types in the search bar.
 * @returns {JSX.Element} A React component.
 */
export default function SearchBar ({ onSearch, value }) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        id="filter"
        name="filter"
        placeholder="Search Pals..."
        value={value}
        onChange={(e) => onSearch(e.target.value)} 
        className={styles.searchInput} 
        aria-label='Search for pals'
      />
    </div>
  );
};

SearchBar.displayName = 'SearchBar'