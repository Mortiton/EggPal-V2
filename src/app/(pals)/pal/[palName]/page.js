import { getAllPalInfo, fetchBreedingCombos } from "./actions";
// import BreedingList from "./components/BreedingList";
// import PalDetailsCard from "./components/PalDetailsCard";
import styles from "./page.module.css";

// Function to generate dynamic metadata based on the Pal's name.
export async function generateMetadata({ params }) {
    const palName = decodeURIComponent(params.palName);
    const pal = await getAllPalInfo(palName);
  
    if (!pal) {
      return {
        title: "Pal not found",
        description: "No details available",
      };
    }
  
    return {
      title: `${pal.name} - Details and Breeding Combinations`,
      description: `All about ${pal.name}'s base skills and breeding combinations`,
    };
  }

export default async function PalPage({ params }) {
    const palName = decodeURIComponent(params.palName);
    const pal = await getAllPalInfo(palName);
    const breedingCombos = await fetchBreedingCombos(palName);

    if (!pal) {
        return <div>Pal not found</div>;
    }
    
    return (
        <div className={styles.mainContainer}>
          <div className={styles.palDetailsContainer}>
            {/* <PalDetailsCard pal={pal} /> */}
          </div>
          <div className={styles.breedingContainer}>
            <h2>Breeding Combinations</h2>
            {/* <BreedingList breedingCombos={breedingCombos} /> */}
          </div>
        </div>
      );
    }