"use client";

import React, { useMemo, useCallback } from "react";
import { useFavourites } from "@/app/context/FavouritesContext";
import PalDetailsCard from "./PalDetailsCard";
import BreedingList from "./BreedingList";
import styles from "../page.module.css";
import { toast } from "react-toastify";

const PalDetailsDisplay = ({ pal, breedingCombos }) => {
  const { favourites, addFavourite, removeFavourite, session } = useFavourites();

  const isFavourited = useMemo(() => 
    session?.user ? favourites.some((fav) => fav.id === pal.id) : false,
    [session, favourites, pal.id]
  );

  const handleToggleFavourite = useCallback(() => {
    if (!session?.user) {
      toast.info("Please log in to favourite pals.");
      return;
    }
    if (isFavourited) {
      removeFavourite(pal.id);
    } else {
      addFavourite(pal);
    }
  }, [session, isFavourited, pal, addFavourite, removeFavourite]);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.palDetailsContainer}>
        <PalDetailsCard
          pal={pal}
          isFavourited={isFavourited}
          onToggleFavourite={handleToggleFavourite}
          session={session}
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

export default React.memo(PalDetailsDisplay);