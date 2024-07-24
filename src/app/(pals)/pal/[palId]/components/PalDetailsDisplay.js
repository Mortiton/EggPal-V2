"use client";

import React, { useEffect, useState } from "react";
import PalDetailsCard from "./PalDetailsCard";
import { useUser } from "@/app/context/UserContext";
import { useFavourites } from "@/app/context/FavouritesContext";

/**
 * PalDetailsDisplay component that handles the display and interactions for Pal details.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.pal - The pal details.
 * @param {Object} props.initialUser - The initial user data.
 * @returns {JSX.Element} A React component.
 */
const PalDetailsDisplay = ({ pal, initialUser }) => {
  const { user, setUser } = useUser();
  const { favourites, addFavourite, removeFavourite } = useFavourites();
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  useEffect(() => {
    if (user) {
      setIsFavourited(favourites.some(fav => fav.id === pal.id));
    }
  }, [favourites, pal.id, user]);

  const handleToggleFavourite = () => {
    if (isFavourited) {
      removeFavourite(pal.id);
    } else {
      addFavourite(pal);
    }
    setIsFavourited(!isFavourited);
  };

  return (
    <PalDetailsCard
      pal={pal}
      isFavourited={isFavourited}
      onToggleFavourite={handleToggleFavourite}
    />
  );
};

PalDetailsDisplay.displayName = 'PalDetailsDisplay';
export default PalDetailsDisplay;
