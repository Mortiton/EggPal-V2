"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles/PalList.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp as upArrow } from "@fortawesome/free-solid-svg-icons";
import PalCard from "./PalCard";
import Searchbar from "./Searchbar";
import TypeDropdown from "./TypeDropDown";
import WorkDropDown from "./WorkDropDown";

export default function PalList({ pals }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredPals = pals.filter((pal) => {
    const matchesSearch = pal.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      !selectedType || pal.type1 === selectedType || pal.type2 === selectedType;
    const matchesWork = !selectedWork || (pal[selectedWork] || 0) > 0;

    return matchesSearch && matchesType && matchesWork;
  });

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

  return (
    <div>
      <Searchbar onSearch={setSearchQuery} />
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
      <div className={styles.cardContainer}>
        {filteredPals.length > 0 ? (
          filteredPals.map((pal) => (
            <Link
              className={styles.cardLink}
              key={pal.id}
              href={`/pal/${encodeURIComponent(pal.name)}`}
              passHref
            >
              <PalCard
                key={pal.id}
                palName={pal.name}
                palId={pal.id}
                type1={pal.type1}
                type2={pal.type2}
                workAttributes={{
                  kindling: pal.kindling,
                  watering: pal.watering,
                  planting: pal.planting,
                  generating_electricity: pal.generating_electricity,
                  handiwork: pal.handiwork,
                  gathering: pal.gathering,
                  lumbering: pal.lumbering,
                  mining: pal.mining,
                  medicine_production: pal.medicine_production,
                  cooling: pal.cooling,
                  transporting: pal.transporting,
                  farming: pal.farming,
                }}
              />{" "}
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