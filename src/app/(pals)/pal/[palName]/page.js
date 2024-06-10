import { getPalDetailsAndFavorites, fetchSavedBreedingCombos } from "./actions";
import BreedingList from "./components/BreedingList";
import PalDetailsCard from "./components/PalDetailsCards";
import styles from "./page.module.css";
import { createClient } from "@/app/utils/supabase/server";

// Function to generate dynamic metadata based on the Pal's name.
export async function generateMetadata({ params }) {
  const palName = decodeURIComponent(params.palName);
  const data = await getPalDetailsAndFavorites(null, palName);

  if (!data || !data.pal_info) {
    return {
      title: "Pal not found",
      description: "No details available",
    };
  }

  return {
    title: `${data.pal_info.name} - Details and Breeding Combinations`,
    description: `All about ${data.pal_info.name}'s base skills and breeding combinations`,
  };
}

export default async function PalPage({ params }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user) {
  //   return <div>Please log in to view this page.</div>;
  // }

  const palName = decodeURIComponent(params.palName);
  const data = await getPalDetailsAndFavorites(user.id, palName);

  if (!data || !data.pal_info) {
    return <div>No Pal information available.</div>;
  }

  const { pal_info: pal, breeding_combos: breedingCombos, favorites } = data;

  const savedBreedingCombos = await fetchSavedBreedingCombos(user.id);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.palDetailsContainer}>
        <PalDetailsCard pal={pal} user={user} userFavorites={favorites} />
      </div>
      <div className={styles.breedingContainer}>
        <h2>Breeding Combinations</h2>
        <BreedingList breedingCombos={breedingCombos} user={user} savedBreedingCombos={savedBreedingCombos} />
      </div>
    </div>
  );
}
