import { fetchSavedBreedingCombos } from './actions';
import { createClient } from '@/app/utils/supabase/server';
import ChildButton from './components/ChildButton';
import styles from './page.module.css';
import BreedingCombosDisplay from './components/BreedingCombosDisplay';

/**
 * SavedBreedingPage component that displays the saved breeding combinations.
 *
 * @returns {JSX.Element} A React component.
 */
export default async function SavedBreedingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  const savedCombos = await fetchSavedBreedingCombos(user.id);

  const groupedByChild = savedCombos.reduce((acc, combo) => {
    const childName = combo.child.name;
    if (!acc[childName]) {
      acc[childName] = [];
    }
    acc[childName].push(combo);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Breeding Combinations</h2>
      <p className={styles.description}>Click the pal to reveal their breeding combinations.</p>
      <div className={styles.childGrid}>
        <BreedingCombosDisplay combos={groupedByChild} userId={user.id} />
      </div>
    </div>
  );
}