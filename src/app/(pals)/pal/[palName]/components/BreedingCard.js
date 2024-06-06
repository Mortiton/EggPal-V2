"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/BreedingCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function BreedingCard({ parent1, parent2 }) {
    const [favourite, setFavourite] = useState(false);
  
    const toggleFavourite = () => {
      setFavourite(!favourite);
      console.log("Clicked!"); 
    };

    return (
        <div className={styles.card}>
          {/* Parent 1 section with image and name */}
          <div className={styles.parent}>
            <Link href={`/pal/${encodeURIComponent(parent1.name)}`} passHref>
              <Image
                src={parent1.image}
                alt={parent1.name}
                className={styles.parentImage}
                height={60}
                width={60}
                unoptimized
              />
            </Link>
            <span className={styles.parentName}>{parent1.name}</span>
          </div>
    
          {/* Icon indicating addition (typically used in UIs to represent combination or addition) */}
          <FontAwesomeIcon
            icon={faPlus}
            className={styles.plusIcon}
            aria-label="plus"
          />
    
          {/* Parent 2 section with image and name */}
          <div className={styles.parent}>
            <Link href={`/pal/${encodeURIComponent(parent2.name)}`} passHref>
              <Image
                src={parent2.image}
                alt={parent2.name}
                className={styles.parentImage}
                height={60}
                width={60}
                unoptimized
              />
            </Link>
            <span className={styles.parentName}>{parent2.name}</span>
          </div>
    
          {/* Favorite icon toggle for marking the breeding pair as favorite */}
          <FontAwesomeIcon
            icon={favourite ? fasHeart : farHeart}
            className={styles.favouriteIcon}
            onClick={toggleFavourite}
            data-favorite={favourite ? "filled" : "empty"}
            aria-label="favourite"
          />
        </div>
      );
    }