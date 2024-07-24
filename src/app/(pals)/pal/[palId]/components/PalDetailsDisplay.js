"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { useFavourites } from "@/app/context/FavouritesContext";
import PalDetailsCard from "./PalDetailsCard";
import BreedingList from "./BreedingList";
import { getBreedingCombinations } from "@/app/services/palService";
import styles from "../page.module.css";

/**
 * PalDetailsDisplay component that renders Pal details and breeding combinations.
 *
 * @component
 * @param {Object} props - The props that were defined by the caller of this component.
 * @param {Object} props.pal - The pal details.
 * @returns {JSX.Element} A React component.
 */
const PalDetailsDisplay = ({ pal }) => {
  const { user } = useUser();
  const { favourites, addFavourite, removeFavourite } = useFavourites();
  const [breedingCombos, setBreedingCombos] = useState([]);

  useEffect(() => {
    const fetchBreedingCombos = async () => {
      try {
        const combos = await getBreedingCombinations(pal.name);
        setBreedingCombos(combos);
      } catch (error) {
        console.error('Error fetching breeding combinations:', error);
        toast.error('Failed to load breeding combinations');
      }
    };

    fetchBreedingCombos();
  }, [pal.name]);

  const isFavourited = user ? favourites.some((fav) => fav.id === pal.id) : false;

  const handleToggleFavourite = () => {
    if (!user) {
      toast.info('Please log in to favourite pals.');
      return;
    }
    if (isFavourited) {
      removeFavourite(pal.id);
    } else {
      addFavourite(pal);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.palDetailsContainer}>
        <PalDetailsCard
          pal={pal}
          isFavourited={isFavourited}
          onToggleFavourite={handleToggleFavourite}
          user={user}
        />
      </div>
      <div className={styles.breedingContainer}>
        <h2>Breeding Combinations</h2>
        <BreedingList breedingCombos={breedingCombos} />
      </div>
    </div>
  );
};

PalDetailsDisplay.displayName = "PalDetailsDisplay";

export default PalDetailsDisplay;