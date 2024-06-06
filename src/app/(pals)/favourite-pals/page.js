import { getFavoritePals } from "./actions";
import PalCard from "@/app/components/PalCard";
import styles from "./page.module.css";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function FavouritePalsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login"); // Redirect to login if user is not authenticated
  }

  const favoritePals = await getFavoritePals(user.id);

  if (favoritePals.length === 0) {
    return <div className={styles.noFavText}>No favorite pals found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Your Favourite Pals</h1>
      <div className={styles.palGrid}>
        {favoritePals.map((pal) => (
          <PalCard pal={pal} />
        ))}
      </div>
    </div>
  );
}
