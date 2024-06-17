"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { addFavoritePal, removeFavoritePal } from '../actions';
import styles from "./styles/PalDetailsCard.module.css";
import WorkIcon from "@/app/components/WorkIcon";
import { toast } from 'react-toastify';


/**
 * PalDetailsCard component that renders a card with details about a pal.
 * It displays a favorite icon, the pal's name, image, description, and base skills.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.pal - The pal.
 * @param {Object} props.user - The user.
 * @param {Array} props.userFavorites - The user's favorite pals.
 * @returns {JSX.Element} A React component.
 */
export default function PalDetailsCard({ pal, user, userFavorites }) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFavourited(userFavorites.includes(pal.id));
    }
  }, [userFavorites, pal.id, user]);

  const handleToggleFavourite = async () => {
    if (!user) {
      toast.info('Please log in to favorite pals.');
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isFavourited) {
        await removeFavoritePal(user.id, pal.id);
      } else {
        await addFavoritePal(user.id, pal.id);
      }
      setIsFavourited(!isFavourited);
    } catch (error) {
      console.error('Error toggling favorite:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const workAttributes = {
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
  };

  return (
    <div className={styles.container}>
      <FontAwesomeIcon
        icon={isFavourited ? fasStar : farStar}
        className={styles.favoriteIcon}
        aria-label="Toggle Favourite"
        data-favourite={isFavourited ? "filled" : "empty"}
        onClick={handleToggleFavourite}
        role="button"
        tabIndex="0"
      />
      <h1>{pal.name}</h1>
      <Image
        src={`/images/pals/${pal.id}.png`}
        alt={pal.name}
        className={styles.image}
        width={120}
        height={120}
        unoptimized
      />
      <p className={styles.description}>{pal.description}</p>
      <h2>Base Skills</h2>
      <div className={styles.baseSkills} role="list" aria-label="List of base skills">
        {Object.entries(workAttributes).map(
          ([iconName, value]) =>
            value > 0 && (
              <div className={styles.workEntry} key={iconName}>
                <WorkIcon iconName={iconName} />
                <span className={styles.workName}>
                  {iconName.replace("_", " ")}:
                </span>
                <span className={styles.level}>{value}</span>
              </div>
            )
        )}
      </div>
    </div>
  );
}
