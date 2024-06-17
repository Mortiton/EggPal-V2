import { getFavoritePals, deleteFavouritePal } from "./actions";
import PalCard from "@/app/components/PalCard";
import styles from "./page.module.css";
import { createClient } from "@/app/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";


export const metadata = {
  title: 'Your Favourite Pals',
  description: 'View your favourite pals',
};

/**
 * FavouritePalsPage component
 * @returns {JSX.Element} The rendered JSX element
 */
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
      <h2 className={styles.title}>Your Favourite Pals</h2>
      <p className={styles.description}>Below are you favourite pals. Click the pal to view their page.</p>
      <div className={styles.palGrid}>
        {favoritePals.map((pal) => (
          <Link
              className={styles.cardLink}
              key={pal.id}
              href={`/pal/${encodeURIComponent(pal.name)}`}
              passHref
              role="listitem"
              aria-label={`View details for ${pal.name}`}
            >
              <PalCard pal={pal} />
            </Link>
        ))}
      </div>
    </div>
  );
}