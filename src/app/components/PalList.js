"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp as upArrow,
  faArrowDown as downArrow,
} from "@fortawesome/free-solid-svg-icons";
import PalCard from "./PalCard";
import SearchBar from "./SearchBar";
import TypeDropdown from "./TypeDropDown";
import WorkDropDown from "./WorkDropDown";
import styles from "./styles/PalList.module.css";

/**
 * @typedef {Object} Pal
 * @property {string} id - The unique identifier of the pal
 * @property {string} name - The name of the pal
 * @property {string} type1 - The primary type of the pal
 * @property {string} [type2] - The secondary type of the pal (if any)
 * @property {Array<{skill_name: string, skill_level: number}>} skills - The skills of the pal
 */

/**
 * PalList component for displaying, filtering, and sorting a list of pals.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array<Pal>} props.pals - The array of pal objects to display
 * @param {Array<string>} props.workTypes - The array of available work types
 * @param {Array<string>} props.types - The array of available pal types
 * @returns {JSX.Element} The rendered PalList component
 */
const PalList = ({ pals, workTypes, types }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);

  /**
   * Effect hook to manage the scroll-to-top button visibility
   */
  useEffect(() => {
    const container = document.querySelector(".page-container");

    /**
     * Checks the scroll position and updates the scroll button visibility
     */
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

  /**
   * Scrolls the page to the top smoothly
   */
  const scrollToTop = () => {
    const container = document.querySelector(".page-container");
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /**
   * Handles the sort order change when a sort button is clicked
   *
   * @param {string} newOrder - The new sort order ('asc' or 'desc')
   */
  const handleSortClick = (newOrder) => {
    setSortOrder((currentOrder) =>
      currentOrder === newOrder ? null : newOrder
    );
  };

  /**
   * Filters and sorts the pals based on the current search query, selected type, work, and sort order
   *
   * @type {Array<Pal>}
   */
  const filteredAndSortedPals = pals
    .filter((pal) => {
      const matchesSearch = pal.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType =
        !selectedType ||
        pal.type1 === selectedType ||
        pal.type2 === selectedType;
      const matchesWork =
        !selectedWork ||
        pal.skills.some((skill) => skill.skill_name === selectedWork);
      return matchesSearch && matchesType && matchesWork;
    })
    .sort((a, b) => {
      if (!selectedWork || !sortOrder) return 0;
      const skillA =
        a.skills.find((skill) => skill.skill_name === selectedWork)
          ?.skill_level || 0;
      const skillB =
        b.skills.find((skill) => skill.skill_name === selectedWork)
          ?.skill_level || 0;
      return sortOrder === "asc" ? skillA - skillB : skillB - skillA;
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
            onSelectWork={(workName) => {
              setSelectedWork(workName);
              setSortOrder(null);
            }}
            aria-label="Work filter dropdown"
          />
        </div>

        {(selectedType || selectedWork) && (
          <span
            onClick={() => {
              setSelectedType(null);
              setSelectedWork(null);
              setSortOrder(null);
            }}
            className={styles.clearFilterSpan}
            role="button"
            tabIndex="0"
            aria-label="Clear filters"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedType(null);
                setSelectedWork(null);
                setSortOrder(null);
              }
            }}
          >
            X Clear Filters
          </span>
        )}
      </div>

      <div className={styles.selectedFiltersContainer}>
        {selectedType && (
          <div className={styles.selectedFilterWrapper}>
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
          </div>
        )}
        {selectedWork && (
          <div className={styles.selectedFilterWrapper}>
            <div className={styles.selectedFilter}>
              Work: {selectedWork.replace("_", " ")}
              <button
                className={styles.clearIndividualFilter}
                onClick={() => {
                  setSelectedWork(null);
                  setSortOrder(null);
                }}
                aria-label={`Clear ${selectedWork.replace("_", " ")} filter`}
              >
                X
              </button>
            </div>
            <div className={styles.sortButtonGroup}>
              <button
                className={`${styles.sortButton} ${
                  sortOrder === "asc" ? styles.active : ""
                }`}
                onClick={() => handleSortClick("asc")}
                aria-label={`Sort ${selectedWork.replace(
                  "_",
                  " "
                )} skill level ascending`}
              >
                <FontAwesomeIcon icon={upArrow} />
              </button>
              <button
                className={`${styles.sortButton} ${
                  sortOrder === "desc" ? styles.active : ""
                }`}
                onClick={() => handleSortClick("desc")}
                aria-label={`Sort ${selectedWork.replace(
                  "_",
                  " "
                )} skill level descending`}
              >
                <FontAwesomeIcon icon={downArrow} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardContainer}>
        {filteredAndSortedPals.length > 0 ? (
          filteredAndSortedPals.map((pal) => (
            <Link
              className={styles.cardLink}
              key={pal.id}
              href={`/pal/${encodeURIComponent(pal.id)}`}
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
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={upArrow} />
        </button>
      )}
    </div>
  );
};

export default React.memo(PalList);
