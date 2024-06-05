"use client";
import React from 'react';
import styles from './styles/searchbar.module.css'; // Import specific styles for the search bar

export default function SearchBar ({ onSearch }) {
  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        id="filter"
        name="filter"
        placeholder="Search for a Pal..."
        onChange={(e) => onSearch(e.target.value)} 
        className={styles.searchInput} 
      />
    </div>
  );
};

