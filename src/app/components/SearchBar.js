"use client";
import React from "react";
import styles from "./styles/SearchBar.module.css";

/**
 * SearchBar component for filtering pals.
 *
 * @component
 * @param {Object} props - The component props
 * @param {function} props.onSearch - Callback function to handle search input changes
 * @param {string} [props.value] - The current value of the search input
 * @returns {JSX.Element} The rendered SearchBar component
 */
export default function SearchBar({ onSearch, value }) {
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
        aria-label="Search for pals"
      />
    </div>
  );
}

SearchBar.displayName = "SearchBar";
