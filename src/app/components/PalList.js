"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/PalList.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp as upArrow } from "@fortawesome/free-solid-svg-icons";
import PalCard from "./PalCard";
import SearchBar from "./SearchBar";
import TypeDropdown from "./TypeDropDown";
import WorkDropDown from "./WorkDropDown";

/**
 * PalList component that renders a list of pals.
 * It provides search and filter functionality.
 *
 * @component
 * @param {Object[]} pals - The list of pals to display.
 * @returns {JSX.Element} A React component.
 */
export default function PalList({ pals }) {
  // State variables for search and filter functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Effect to show a scroll to top button when the user scrolls down
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Filter the pals based on the search query and selected type and work
  const filteredPals = pals.filter((pal) => {
    const matchesSearch = pal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      !selectedType || pal.type1 === selectedType || pal.type2 === selectedType;
    const matchesWork = !selectedWork || (pal[selectedWork] || 0) > 0;

    return matchesSearch && matchesType && matchesWork;
  });

  // The available types and work for the dropdowns
  const types = [
    { name: "neutral" },
    { name: "dark" },
    { name: "dragon" },
    { name: "electric" },
    { name: "fire" },
    { name: "grass" },
    { name: "ground" },
    { name: "ice" },
    { name: "water" },
  ];

  const work = [
    { name: "kindling" },
    { name: "watering" },
    { name: "planting" },
    { name: "generating_electricity" },
    { name: "handiwork" },
    { name: "gathering" },
    { name: "lumbering" },
    { name: "mining" },
    { name: "medicine_production" },
    { name: "cooling" },
    { name: "transporting" },
    { name: "farming" },
  ];

  // Render the component
  return (
    <div>
      <SearchBar onSearch={setSearchQuery} />
      <div className={styles.filterContainer}>
        <span>Filter by:</span>
        <div className={styles.dropdownButtonsContainer}>
          <TypeDropdown
            types={types}
            onSelectType={(typeName) => setSelectedType(typeName)}
          />
          <WorkDropDown
            work={work}
            onSelectWork={(workName) => setSelectedWork(workName)}
          />
        </div>

        {(selectedType || selectedWork) && (
          <span
            onClick={() => {
              setSelectedType(null);
              setSelectedWork(null);
            }}
            className={styles.clearFilterSpan}
            role="button"
            tabIndex="0"
          >
            X Clear Filter
          </span>
        )}
      </div>

{/* Display currently selected filters */}
<div className={styles.selectedFiltersContainer}>
        {selectedType && (
          <div className={styles.selectedFilter}>
            Type: {selectedType}
            <button
              className={styles.clearIndividualFilter}
              onClick={() => setSelectedType(null)}
            >
              X
            </button>
          </div>
        )}
        {selectedWork && (
          <div className={styles.selectedFilter}>
            Work: {selectedWork.replace("_", " ")}
            <button
              className={styles.clearIndividualFilter}
              onClick={() => setSelectedWork(null)}
            >
              X
            </button>
          </div>
        )}
      </div>

      <div className={styles.cardContainer}>
        {filteredPals.length > 0 ? (
          filteredPals.map((pal) => (
            <Link
              className={styles.cardLink}
              key={pal.id}
              href={`/pal/${encodeURIComponent(pal.name)}`}
              passHref
            >
              <PalCard pal={pal} />
            </Link>
          ))
        ) : (
          <p>No pals found.</p>
        )}
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className={styles.scrollToTopButton}
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
        >
          <FontAwesomeIcon icon={upArrow} />
        </button>
      )}
    </div>
  );
}