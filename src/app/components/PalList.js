'use client';

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
 * @param {Object[]} workTypes - The list of work types to filter by.
 * @param {Object[]} types - The list of types to filter by.
 * @returns {JSX.Element} A React component.
 */
const PalList = ({ pals, workTypes, types }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const container = document.querySelector('.page-container');

    const checkScroll = () => {
      const scrollTop = container ? container.scrollTop : 0;
      if (scrollTop > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const scrollToTop = () => {
    const container = document.querySelector('.page-container');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const filteredPals = pals.filter((pal) => {
    const matchesSearch = pal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || pal.type1 === selectedType || pal.type2 === selectedType;
    const matchesWork = !selectedWork || pal.skills.some(skill => skill.skill_name === selectedWork);

    return matchesSearch && matchesType && matchesWork;
  });

  return (
    <div className={styles.container}>
      <SearchBar onSearch={setSearchQuery} />
      <div className={styles.filterContainer}>
        <span>Filter by:</span>
        <div className={styles.dropdownButtonsContainer}>
          <TypeDropdown
            types={types}
            onSelectType={(typeName) => setSelectedType(typeName)}
            aria-label="Type filter dropdown"
          />
          <WorkDropDown
            work={workTypes}
            onSelectWork={(workName) => setSelectedWork(workName)}
            aria-label="Work filter dropdown"          
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
            aria-label="Clear filters"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedType(null);
                setSelectedWork(null);
              }
            }}
          >
            X Clear Filters
          </span>
        )}
      </div>

      <div className={styles.selectedFiltersContainer}>
        {selectedType && (
          <div className={styles.selectedFilter}>
            Type: {selectedType}
            <button
              className={styles.clearIndividualFilter}
              onClick={() => setSelectedType(null)}
              aria-label={`Clear ${selectedType} filter`}
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
              aria-label={`Clear ${selectedWork.replace("_", " ")} filter`}
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
              aria-label={`View details for ${pal.name}`}
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
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={upArrow} />
        </button>
      )}
    </div>
  );
};

PalList.displayName = 'PalList';

export default React.memo(PalList);